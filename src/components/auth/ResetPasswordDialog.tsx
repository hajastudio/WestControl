
import { useState } from "react";
import { Mail } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResetPasswordDialog({ open, onOpenChange }: ResetPasswordDialogProps) {
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cooldown) {
      toast({
        variant: "destructive",
        title: "Aguarde um momento",
        description: `Por favor aguarde ${cooldownSeconds} segundos antes de tentar novamente.`,
      });
      return;
    }
    
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) {
        // Check if it's a rate limit error
        if (error.message.includes("security purposes") && error.message.includes("seconds")) {
          // Extract the number of seconds to wait from the error message
          const secondsMatch = error.message.match(/(\d+) seconds/);
          const waitSeconds = secondsMatch ? parseInt(secondsMatch[1]) : 30;
          
          setCooldownSeconds(waitSeconds);
          setCooldown(true);
          
          // Set a timer to reset the cooldown
          setTimeout(() => {
            setCooldown(false);
            setCooldownSeconds(0);
          }, waitSeconds * 1000);
          
          throw new Error(`Por favor aguarde ${waitSeconds} segundos antes de solicitar outro link.`);
        }
        throw error;
      }

      toast({
        title: "Link enviado!",
        description: "Enviamos um link para redefinir sua senha! Verifique seu e-mail.",
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar link",
        description: error.message || "E-mail não encontrado ou não registrado.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recuperar senha</DialogTitle>
          <DialogDescription>
            Digite seu e-mail para receber um link de recuperação de senha.
            {cooldown && (
              <p className="mt-2 text-sm text-red-500">
                Por favor aguarde {cooldownSeconds} segundos antes de tentar novamente.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              type="email"
              placeholder="seu.email@exemplo.com"
              className="pl-10"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-[#2b24a3] hover:bg-[#2b24a3]/90"
            disabled={loading || cooldown}
          >
            {loading ? "Enviando..." : cooldown ? `Aguarde ${cooldownSeconds}s` : "Enviar link de recuperação"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
