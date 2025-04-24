
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useRoleAccess = (requiredRole: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkRoleAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("Usuário não autenticado");
        }

        const { data: roleData, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error || !roleData) {
          throw new Error("Usuário não encontrado");
        }

        if (roleData.role !== requiredRole) {
          throw new Error("Acesso não autorizado");
        }

        setIsAuthorized(true);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Acesso Negado",
          description: error.message || "Você não tem permissão para acessar esta página.",
        });
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkRoleAccess();
  }, [requiredRole, navigate, toast]);

  return { isLoading, isAuthorized };
};
