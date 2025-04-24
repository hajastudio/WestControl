
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Get the Supabase project URL dynamically
  const projectUrl = Deno.env.get('SUPABASE_PROJECT_URL') || 'https://your-project.supabase.co'
  
  // Construct a standard webhook endpoint
  const webhookUrl = `${projectUrl}/functions/v1/webhook-handler`

  return new Response(
    JSON.stringify({ webhookUrl }), 
    { 
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      } 
    }
  )
})
