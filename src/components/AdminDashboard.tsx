import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminSidebar } from "./admin/AdminSidebar";
import { LeadsOverview } from "./admin/leads/LeadsOverview";
import { AutomationConfig } from "./admin/AutomationConfig";
import { WhatsAppConfig } from "./admin/WhatsAppConfig";
import { ViabilityManager } from "./admin/ViabilityManager";
import { DashboardOverview } from "./admin/dashboard/DashboardOverview";
import { UsersManagement } from "./admin/UsersManagement";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { EmailTemplatesManager } from "./admin/EmailTemplatesManager";
import { Settings } from "lucide-react";
import { MarketingConfig } from "./admin/MarketingConfig";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [viableAreas, setViableAreas] = useState([]);
  const [configurations, setConfigurations] = useState({
    whatsapp_number: '',
    webhook_url: '',
    default_message: ''
  });
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalUsers: 0,
    viableAreas: 0,
    pendingLeads: 0,
    viableLeads: 0,
    notViableLeads: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([
      fetchLeads(),
      fetchUsers(),
      fetchViableAreas(),
      fetchConfigurations()
    ]);
  };

  const fetchLeads = async () => {
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (data) {
      setLeads(data);
      const pendingCount = data.filter(lead => lead.status === 'pending').length;
      const viableCount = data.filter(lead => lead.status === 'viable').length;
      const notViableCount = data.filter(lead => lead.status === 'not_viable').length;
      
      setStats(prev => ({
        ...prev,
        totalLeads: data.length,
        pendingLeads: pendingCount,
        viableLeads: viableCount,
        notViableLeads: notViableCount
      }));
    }
    if (error) console.error('Error fetching leads:', error);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        user_id,
        role,
        created_at
      `);
    
    if (data) {
      setUsers(data);
      setStats(prev => ({ ...prev, totalUsers: data.length }));
    }
    if (error) console.error('Error fetching users:', error);
  };

  const fetchViableAreas = async () => {
    const { data, error } = await supabase
      .from('viability')
      .select('*')
      .eq('is_viable', true);
    
    if (data) {
      setViableAreas(data);
      setStats(prev => ({ ...prev, viableAreas: data.length }));
    }
    if (error) console.error('Error fetching viable areas:', error);
  };

  const fetchConfigurations = async () => {
    const { data, error } = await supabase
      .from('configurations')
      .select('*')
      .single();
    
    if (data) setConfigurations(data);
    if (error) console.error('Error fetching configurations:', error);
  };

  const chartData = [
    { name: 'Pendentes', value: stats.pendingLeads, fill: '#FFA500' },
    { name: 'Viáveis', value: stats.viableLeads, fill: '#4CAF50' },
    { name: 'Não Viáveis', value: stats.notViableLeads, fill: '#F44336' }
  ];

  const menuItems = [
    {
      title: "Dashboard",
      icon: Settings,
      value: "dashboard",
    },
    {
      title: "Leads",
      icon: Settings,
      value: "leads",
    },
    {
      title: "Usuários",
      icon: Settings,
      value: "users",
    },
    {
      title: "Viabilidade",
      icon: Settings,
      value: "viability",
    },
    {
      title: "Automação",
      icon: Settings,
      value: "automation",
    },
    {
      title: "Notificações",
      icon: Settings,
      value: "notifications",
    },
    {
      title: "Personalização de E-mails",
      icon: Settings,
      value: "email-customization",
    },
    {
      title: "Marketing & SEO",
      icon: Settings,
      value: "marketing",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview stats={stats} leads={leads} />;
      case "leads":
        return <LeadsOverview />;
      case "users":
        return <UsersManagement users={users} />;
      case "viability":
        return <ViabilityManager />;
      case "automation":
        return <AutomationConfig />;
      case "notifications":
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Notificações WhatsApp</h2>
            <WhatsAppConfig 
              configurations={configurations}
              onConfigUpdate={setConfigurations}
            />
          </div>
        );
      case "email-customization":
        return <EmailTemplatesManager />;
      case "marketing":
        return <MarketingConfig />;
      default:
        return <div>Selecione uma aba para visualizar</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider defaultOpen={true}>
        <div className="flex w-full min-h-screen">
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarInset>
            <div className="px-8 py-6">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold flex items-center">
                    <SidebarTrigger className="mr-2" />
                    Painel Administrativo
                  </h1>
                  <p className="text-gray-600">Gerencie leads, viabilidade e configurações</p>
                </div>
              </div>
              {renderTabContent()}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminDashboard;
