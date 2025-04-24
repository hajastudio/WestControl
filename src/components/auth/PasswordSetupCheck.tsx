
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PasswordSetupCheckProps {
  children: React.ReactNode;
}

export function PasswordSetupCheck({ children }: PasswordSetupCheckProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminBypass, setAdminBypass] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkPasswordSetup(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      checkPasswordSetup(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkPasswordSetup = async (session: Session | null) => {
    if (!session) {
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      // Check if user is an admin
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (roleError) throw roleError;
      
      const isAdmin = roleData?.role === 'admin';
      
      // If admin, allow bypassing the password check
      if (isAdmin) {
        console.log("Admin user detected, allowing bypass of password setup");
        setAdminBypass(true);
        setNeedsPasswordSetup(false);
        setLoading(false);
        return;
      }
      
      // For non-admin users, check if password is set
      const isEmailProvider = session.user.app_metadata.provider === "email";
      
      const hasNoPassword = isEmailProvider && 
                            (!session.user.identities || 
                             !session.user.identities.some(identity => 
                                identity.provider === "email" && identity.identity_data?.has_password === true)
                            );
      
      setNeedsPasswordSetup(hasNoPassword);
      setLoading(false);
    } catch (error) {
      console.error("Error checking user status:", error);
      setLoading(false);
    }
  };

  const handleSendPasswordSetupLink = async () => {
    if (!session?.user.email) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(session.user.email);
      if (error) throw error;

      toast({
        title: "Link enviado!",
        description: "Enviamos o link de definição de senha para o seu e-mail. Verifique sua caixa de entrada (e o spam também!)",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar link",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBypassCheck = () => {
    setNeedsPasswordSetup(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#efeef6] p-4">Carregando...</div>;
  }

  if (needsPasswordSetup && !adminBypass) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#efeef6] p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>🚧 Senha ainda não definida</CardTitle>
            <CardDescription>
              Para garantir o acesso completo ao painel, você precisa definir uma senha segura.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Ação necessária</AlertTitle>
              <AlertDescription>
                Clique no botão abaixo para receber o link por e-mail
              </AlertDescription>
            </Alert>
            <Button 
              onClick={handleSendPasswordSetupLink} 
              disabled={loading}
              className="w-full mb-2"
            >
              🔁 Enviar Link para Definir Senha
            </Button>
            
            {adminBypass && (
              <Button 
                onClick={handleBypassCheck} 
                variant="outline" 
                className="w-full"
              >
                Continuar sem definir senha
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
