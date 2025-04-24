
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EmailInput } from "@/components/auth/EmailInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { ResetPasswordDialog } from "@/components/auth/ResetPasswordDialog";
import { NotificationBanner } from "@/components/ui/notification-banner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    title: string;
    description?: string;
  } | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Log the login attempt for debugging
      console.log(`Attempting login with email: ${email}`);
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Usuário não encontrado");

      console.log("Authentication successful, user ID:", authData.user.id);

      // Fetch the user role from user_roles table
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authData.user.id)
        .maybeSingle();

      console.log("Role data response:", roleData, "Error:", roleError);

      if (roleError) throw roleError;
      
      if (!roleData) {
        // If no role is found, try to create a default role for the admin user
        // This is a fallback for the specific admin email
        if (email === 'carlosmascarenhaspublicidades@gmail.com') {
          console.log("Admin email detected but no role found, creating admin role");
          const { error: createRoleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: authData.user.id,
              role: 'admin'
            });
          
          if (createRoleError) {
            console.error("Failed to create admin role:", createRoleError);
            throw new Error("Erro ao configurar perfil de admin. Entre em contato com o suporte.");
          }
          
          // Redirect to admin dashboard after creating the role
          navigate("/admin");
          return;
        } else {
          throw new Error("Perfil de usuário não encontrado. Entre em contato com o administrador.");
        }
      }

      // Redirect based on role
      switch (roleData.role) {
        case "admin":
          navigate("/admin");
          break;
        case "attendant":
          navigate("/attendant");
          break;
        default:
          // Handle any other roles that might be added in the future
          // For now, show an error since we only support admin and attendant roles
          setNotification({
            type: "error",
            title: "Acesso não autorizado",
            description: "Seu acesso ainda não está autorizado. Fale com o administrador.",
          });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setNotification({
        type: "error",
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#efeef6]">
      {notification && (
        <NotificationBanner
          type={notification.type}
          title={notification.title}
          description={notification.description}
          onClose={() => setNotification(null)}
        />
      )}
      <Container className="max-w-md">
        <div className="glassmorphism-card p-8 border-neon">
          <h1 className="text-3xl font-bold text-center mb-8 text-[#2b24a3]">
            Login
          </h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">E-mail</label>
              <EmailInput value={email} onChange={setEmail} />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">Senha</label>
              <PasswordInput value={password} onChange={setPassword} />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setResetPasswordOpen(true)}
                className="text-sm text-[#2b24a3] hover:underline flex items-center gap-2"
              >
                🔁 Esqueci minha senha
              </button>
              <Link 
                to="/cadastro" 
                className="text-sm text-[#db451c] hover:underline"
              >
                Criar conta
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#2b24a3] hover:bg-[#2b24a3]/90" 
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </Container>

      <ResetPasswordDialog 
        open={resetPasswordOpen} 
        onOpenChange={setResetPasswordOpen}
      />
    </div>
  );
}
