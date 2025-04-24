
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface LeadDetailsProps {
  name?: string;
  planType?: string;
  cep?: string;
  status?: string;
}

export const LeadDetails = ({ name, planType, cep, status }: LeadDetailsProps) => {
  return (
    <div>
      <h2 className="font-bold mb-4">Detalhes do Lead</h2>
      <p>Nome: {name}</p>
      <p>Plano: {planType}</p>
      <p>CEP: {cep}</p>
      {status && (
        <Badge variant="secondary" className="mt-2">
          Status: {status}
        </Badge>
      )}
    </div>
  );
};
