
import React, { useState } from "react";
import { AutomationTabs } from "./automation/AutomationTabs";
import { WebhookSection } from "./automation/WebhookSection";
import { TwilioWhatsAppTab } from "./integrations/TwilioWhatsAppTab";

export function AutomationConfig() {
  const [activeTab, setActiveTab] = useState("webhooks");

  return (
    <div>
      <AutomationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div>
        {activeTab === "webhooks" && <WebhookSection />}
        {activeTab === "twilio" && <TwilioWhatsAppTab />}
      </div>
    </div>
  );
}
