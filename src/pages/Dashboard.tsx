import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { NotificationBanner } from "@/components/ui/notification-banner";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { LeadDetails } from "@/components/dashboard/LeadDetails";
import { StagesProgress } from "@/components/dashboard/StagesProgress";
import { NotificationsList } from "@/components/dashboard/NotificationsList";

const Dashboard: React.FC = () => {
  const { isLoading: roleLoading, isAuthorized } = useRoleAccess("client");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [leadData, setLeadData] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    title: string;
    description?: string;
  } | null>(null);

  useEffect(() => {
    const leadId = searchParams.get('id');
    if (!leadId) {
      setLoading(false);
      return;
    }

    const fetchLeadData = async () => {
      try {
        const { data: lead, error: leadError } = await supabase
          .from('leads')
          .select('*')
          .eq('id', leadId)
          .maybeSingle();

        if (leadError) throw leadError;

        const { data: leadNotifications, error: notificationsError } = await supabase
          .from('notifications')
          .select('*')
          .eq('lead_id', leadId)
          .order('created_at', { ascending: true });

        if (notificationsError) throw notificationsError;

        setLeadData(lead);
        setNotifications(leadNotifications || []);
      } catch (error) {
        console.error('Error fetching lead data:', error);
        setNotification({
          type: 'error',
          title: 'Erro ao carregar dados',
          description: 'Não foi possível carregar os dados do lead.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLeadData();
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error: any) {
      setNotification({
        type: "error",
        title: "Erro ao sair",
        description: error.message || "Não foi possível fazer logout.",
      });
    }
  };

  if (roleLoading || loading) return <div>Carregando...</div>;
  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-[#efeef6] p-8">
      {notification && (
        <NotificationBanner
          type={notification.type}
          title={notification.title}
          description={notification.description}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#2b24a3]">👤 Cliente</h1>
          <Button variant="destructive" onClick={handleLogout}>
            Sair
          </Button>
        </div>

        {!leadData ? (
          <Card className="glassmorphism-card bg-white/30 backdrop-blur-lg border-neon">
            <CardContent className="p-8 text-center">
              <p>Nenhum lead encontrado.</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="glassmorphism-card bg-white/30 backdrop-blur-lg border-neon">
            <CardHeader>
              <CardTitle className="text-[#2b24a3]">
                Acompanhamento do Lead
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <LeadDetails 
                  name={leadData?.name}
                  planType={leadData?.planType}
                  cep={leadData?.cep}
                  status={leadData?.status}
                />
                <StagesProgress currentStatus={leadData?.status || 'pendente'} />
              </div>
              <div className="mt-6">
                <NotificationsList notifications={notifications} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
