
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { useToast } from "@/hooks/use-toast";
import AttendantPortal from "@/components/attendant/AttendantPortal";
import { PasswordSetupCheck } from "@/components/auth/PasswordSetupCheck";
import { useRoleAccess } from "@/hooks/useRoleAccess";

export default function Attendant() {
  const [session, setSession] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isLoading, isAuthorized } = useRoleAccess('attendant');

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  if (!isAuthorized) {
    // The useRoleAccess hook already handles redirection
    return null;
  }

  if (!session) {
    navigate('/login');
    return null;
  }

  return (
    <PasswordSetupCheck>
      <AttendantPortal session={session} />
    </PasswordSetupCheck>
  );
}
