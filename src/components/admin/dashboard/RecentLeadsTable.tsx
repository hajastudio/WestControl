
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  cep: string;
  status: string;
}

export function RecentLeadsTable({ leads }: { leads: Lead[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads Recentes</CardTitle>
        <CardDescription>Últimos 5 leads recebidos no sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>CEP</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.slice(0, 5).map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>{lead.whatsapp}</TableCell>
                <TableCell>{lead.cep}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    lead.status === 'viable' ? 'bg-green-100 text-green-800' : 
                    lead.status === 'not_viable' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {lead.status === 'viable' ? 'Viável' : 
                     lead.status === 'not_viable' ? 'Não Viável' : 
                     lead.status === 'pending' ? 'Pendente' : lead.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
