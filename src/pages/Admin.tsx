
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminDashboard from "@/components/AdminDashboard";
import { useToast } from "@/hooks/use-toast";

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log("No authenticated user found");
          setIsAdmin(false);
          setShouldRedirect(true);
          setIsLoading(false);
          return;
        }

        console.log("Checking admin role for user:", user.id);

        // Check if the user has admin role
        const { data: roleData, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        console.log("Role check response:", roleData, "Error:", error);

        if (error) {
          console.error("Error checking admin role:", error);
          toast({
            variant: "destructive",
            title: "Erro de verificação",
            description: "Não foi possível verificar seu perfil de acesso."
          });
          setIsAdmin(false);
          setShouldRedirect(true);
        } else if (!roleData) {
          console.log("No role found for user");
          
          // Special case for the default admin email
          if (user.email === 'carlosmascarenhaspublicidades@gmail.com') {
            console.log("Admin email detected, creating admin role");
            
            // Create admin role for this user
            const { error: createRoleError } = await supabase
              .from('user_roles')
              .insert({
                user_id: user.id,
                role: 'admin'
              });
            
            if (createRoleError) {
              console.error("Failed to create admin role:", createRoleError);
              toast({
                variant: "destructive",
                title: "Erro de configuração",
                description: "Não foi possível configurar seu perfil de admin."
              });
              setIsAdmin(false);
              setShouldRedirect(true);
            } else {
              setIsAdmin(true);
            }
          } else {
            setIsAdmin(false);
            setShouldRedirect(true);
          }
        } else if (roleData.role === 'admin') {
          console.log("Admin role confirmed");
          setIsAdmin(true);
        } else {
          console.log("User has non-admin role:", roleData.role);
          setIsAdmin(false);
          setShouldRedirect(true);
        }
      } catch (error: any) {
        console.error("Admin check error:", error);
        toast({
          variant: "destructive",
          title: "Erro de verificação",
          description: error.message || "Ocorreu um erro ao verificar seu acesso."
        });
        setIsAdmin(false);
        setShouldRedirect(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminRole();
  }, [toast, navigate]);

  // Only show toast and redirect after the component has mounted and we've determined the access status
  useEffect(() => {
    if (!isLoading && shouldRedirect) {
      toast({
        variant: "destructive",
        title: "Acesso restrito",
        description: "Você não tem permissão para acessar esta página."
      });
      // Add small delay to ensure toast is visible before redirect
      const timer = setTimeout(() => {
        navigate("/login", { replace: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, shouldRedirect, toast, navigate]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  if (!isAdmin) {
    return null; // We'll handle the redirect in the useEffect
  }

  return <AdminDashboard />;
};

export default AdminPage;
