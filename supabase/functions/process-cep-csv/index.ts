
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { parse } from 'https://deno.land/std@0.181.0/encoding/csv.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    const { filename, import_id } = await req.json()
    console.log('Processing file:', filename, 'Import ID:', import_id)

    // Download the file from storage
    const { data: fileData, error: downloadError } = await supabaseClient
      .storage
      .from('viability-csv')
      .download(filename)

    if (downloadError) {
      console.error('Error downloading file:', downloadError)
      throw downloadError
    }

    // Parse CSV content
    const content = await fileData.text()
    const rows = parse(content, { skipFirstRow: true, columns: true })
    console.log(`Parsed ${rows.length} rows from CSV`)

    // Update import log with total rows
    await supabaseClient
      .from('import_logs')
      .update({ total_rows: rows.length })
      .eq('id', import_id)

    let processedRows = 0

    // Process each row
    for (const row of rows) {
      try {
        const cep = row['CEP']?.replace(/\D/g, '') // Remove non-digits
        const address = row['Endereço']
        
        console.log(`Processing row: CEP=${cep}, Address=${address}`)

        if (!cep) {
          console.log('Skipping row with missing CEP')
          continue
        }

        // Extract address components
        const addressParts = address?.split(',') || []
        const street = addressParts[0]?.trim() || null
        const number = addressParts[1]?.trim() || null
        const complement = addressParts[2]?.trim() || null
        
        // Insert or update viability record
        const { error: insertError } = await supabaseClient
          .from('viability')
          .upsert({
            cep,
            street,
            number,
            complement,
            is_viable: true,
          })

        if (insertError) {
          console.error('Error inserting viability record:', insertError)
          throw insertError
        }

        processedRows++

        // Update progress every 10 rows
        if (processedRows % 10 === 0 || processedRows === rows.length) {
          console.log(`Progress update: ${processedRows}/${rows.length} rows processed`)
          await supabaseClient
            .from('import_logs')
            .update({ processed_rows: processedRows })
            .eq('id', import_id)
        }
      } catch (rowError) {
        console.error('Error processing row:', rowError)
      }
    }

    // Update final status
    await supabaseClient
      .from('import_logs')
      .update({
        status: 'completed',
        processed_rows: processedRows
      })
      .eq('id', import_id)

    console.log(`Import completed: ${processedRows} records processed`)

    // Delete the uploaded file
    await supabaseClient
      .storage
      .from('viability-csv')
      .remove([filename])

    return new Response(
      JSON.stringify({ success: true, processed: processedRows }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error processing CSV:', error)

    // Update import log with error status
    if (req.body) {
      try {
        const { import_id } = await req.json()
        if (import_id) {
          await supabaseClient
            .from('import_logs')
            .update({
              status: 'error',
              error_message: error.message
            })
            .eq('id', import_id)
        }
      } catch (e) {
        console.error('Error updating import status:', e)
      }
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
