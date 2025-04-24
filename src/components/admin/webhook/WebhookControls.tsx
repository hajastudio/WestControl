
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface WebhookControlsProps {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  webhookMethod: 'POST' | 'GET';
  setWebhookMethod: (method: 'POST' | 'GET') => void;
}

export function WebhookControls({ 
  isEnabled, 
  setIsEnabled, 
  webhookMethod,
  setWebhookMethod
}: WebhookControlsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch 
          id="webhook-enabled" 
          checked={isEnabled}
          onCheckedChange={setIsEnabled}
        />
        <Label htmlFor="webhook-enabled">
          {isEnabled ? "Automação ativada" : "Automação desativada"}
        </Label>
      </div>
      
      {isEnabled && (
        <div className="space-y-2">
          <Label>Método de requisição para teste</Label>
          <RadioGroup 
            value={webhookMethod} 
            onValueChange={(value: 'POST' | 'GET') => setWebhookMethod(value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="POST" id="method-post" />
              <Label htmlFor="method-post">POST</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="GET" id="method-get" />
              <Label htmlFor="method-get">GET</Label>
            </div>
          </RadioGroup>
        </div>
      )}
    </div>
  );
}
