
import React from "react";

export function WebhookDataFormat() {
  const sampleWebhookData = {
    lead: {
      id: "uuid",
      name: "Nome do Cliente",
      email: "email@cliente.com",
      whatsapp: "5511999999999",
      cpf: "123.456.789-00",
      rg: "12.345.678-9",
      planType: "residential",
      businessType: "semi",
      cep: "01234567",
      address: {
        street: "Nome da Rua",
        number: "123",
        complement: "Apto 45",
        neighborhood: "Bairro",
        city: "Cidade",
        state: "UF",
        reference: "Próximo ao mercado"
      },
      status: "viable",
      tracking_url: "https://seu-site.lovable.app/dashboard?id=uuid"
    },
    timestamp: "2025-04-22T12:00:00Z"
  };

  return (
    <div className="flex flex-col space-y-2">
      <h4 className="text-sm font-medium">Dados enviados no webhook:</h4>
      <pre className="p-2 bg-muted rounded-md text-xs overflow-auto">
        {JSON.stringify(sampleWebhookData, null, 2)}
      </pre>
    </div>
  );
}
