
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useFirstRunCheck = () => {
  const [isCheckComplete, setIsCheckComplete] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAndCreateAdminUser = async () => {
      try {
        // Check if this is the first run
        const { data: firstRunCheck, error: checkError } = await supabase.rpc('is_first_run');
        
        if (checkError) {
          throw checkError;
        }

        if (firstRunCheck) {
          console.log("First run detected, creating admin user");
          
          // Create admin user
          const { data, error } = await supabase.auth.signUp({
            email: 'carlosmascarenhaspublicidades@gmail.com',
            password: 'Haju2293*',
          });

          if (error) {
            throw error;
          }

          if (data.user) {
            console.log("Admin user created with ID:", data.user.id);
            
            // Wait a moment to ensure the user is fully created in the auth system
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Insert user role
            const { error: roleError } = await supabase
              .from('user_roles')
              .insert({
                user_id: data.user.id,
                role: 'admin'
              });

            if (roleError) {
              console.error("Error creating admin role:", roleError);
              // Even if role creation fails, we consider setup complete
              // The admin check in the Admin page will handle this case
            } else {
              console.log("Admin role created successfully");
            }

            toast({
              title: "Usuário admin criado",
              description: "Usuário admin inicial configurado com sucesso."
            });
          }
        } else {
          console.log("Not first run, admin user should already exist");
        }
      } catch (error: any) {
        console.error("First run check error:", error);
        toast({
          variant: "destructive",
          title: "Erro na configuração inicial",
          description: error.message || "Não foi possível configurar o usuário admin."
        });
      } finally {
        setIsCheckComplete(true);
      }
    };

    checkAndCreateAdminUser();
  }, [toast]);

  return { isCheckComplete };
};
