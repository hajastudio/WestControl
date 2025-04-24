
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Custom hook to check if the user has access to leads management
 * Only users with 'admin' or 'attendant' roles have access
 */
export const useLeadsAccess = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAccess = async () => {
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
          throw new Error("Perfil de usuário não encontrado");
        }

        // Check if user has admin or attendant role
        if (['admin', 'attendant'].includes(roleData.role)) {
          setHasAccess(true);
        } else {
          throw new Error("Você não tem permissão para gerenciar leads");
        }
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

    checkAccess();
  }, [navigate, toast]);

  return { isLoading, hasAccess };
};
