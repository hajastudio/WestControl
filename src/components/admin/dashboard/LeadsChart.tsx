
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface ChartData {
  pendingLeads: number;
  viableLeads: number;
  notViableLeads: number;
}

export function LeadsChart({ stats }: { stats: ChartData }) {
  const chartData = [
    { name: 'Pendentes', value: stats.pendingLeads, fill: '#FFA500' },
    { name: 'Viáveis', value: stats.viableLeads, fill: '#4CAF50' },
    { name: 'Não Viáveis', value: stats.notViableLeads, fill: '#F44336' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visão Geral de Leads</CardTitle>
        <CardDescription>Distribuição de status dos leads recebidos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
