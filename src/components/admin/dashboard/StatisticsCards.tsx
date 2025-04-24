
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Users, Map, ArrowUp } from "lucide-react";

interface StatsData {
  totalLeads: number;
  totalUsers: number;
  viableAreas: number;
  pendingLeads: number;
}

export function StatisticsCards({ stats }: { stats: StatsData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total de Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-blue-600 mr-2" />
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Usuários do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Users className="h-5 w-5 text-purple-600 mr-2" />
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Áreas com Viabilidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Map className="h-5 w-5 text-green-600 mr-2" />
            <div className="text-2xl font-bold">{stats.viableAreas}</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Leads Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className={`text-2xl font-bold ${stats.pendingLeads > 10 ? 'text-amber-500' : 'text-gray-800'}`}>
              {stats.pendingLeads}
            </div>
            {stats.pendingLeads > 10 && 
              <ArrowUp className="ml-2 h-4 w-4 text-amber-500" />
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
