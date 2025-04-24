
import React from "react";
import { Card } from "@/components/ui/card";
import { WebhookCard } from "./WebhookCard";
import { N8nIntegration } from "../integrations/N8nIntegration";
import { AutomationHistory } from "./AutomationHistory";

export function WebhookSection() {
  return (
    <>
      <WebhookCard />
      <N8nIntegration />
      <AutomationHistory />
    </>
  );
}
