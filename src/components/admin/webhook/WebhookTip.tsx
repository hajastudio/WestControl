
import React from "react";

interface WebhookTipProps {
  webhookMethod: 'POST' | 'GET';
}

export function WebhookTip({ webhookMethod }: WebhookTipProps) {
  return (
    <div className="p-3 bg-muted rounded-md text-sm">
      <h4 className="font-medium mb-2">Dica para teste de webhook:</h4>
      {webhookMethod === 'GET' ? (
        <p>
          Para testar webhooks com GET, você pode usar um serviço como <a href="https://webhook.site" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">webhook.site</a> ou 
          configurar qualquer endpoint que aceite requisições GET.
        </p>
      ) : (
        <p>
          Para testar webhooks com POST, você pode usar um serviço como <a href="https://webhook.site" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">webhook.site</a> para 
          receber e visualizar os dados enviados.
        </p>
      )}
    </div>
  );
}
