
import React from "react";
import { StatisticsCards } from "./StatisticsCards";
import { LeadsChart } from "./LeadsChart";
import { RecentLeadsTable } from "./RecentLeadsTable";

interface DashboardStats {
  totalLeads: number;
  totalUsers: number;
  viableAreas: number;
  pendingLeads: number;
  viableLeads: number;
  notViableLeads: number;
}

interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  cep: string;
  status: string;
}

interface DashboardOverviewProps {
  stats: DashboardStats;
  leads: Lead[];
}

export function DashboardOverview({ stats, leads }: DashboardOverviewProps) {
  return (
    <div className="space-y-6">
      <StatisticsCards stats={stats} />
      <LeadsChart stats={stats} />
      <RecentLeadsTable leads={leads} />
    </div>
  );
}
