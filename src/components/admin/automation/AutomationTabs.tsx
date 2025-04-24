
import React from "react";

interface AutomationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AutomationTabs({ activeTab, setActiveTab }: AutomationTabsProps) {
  return (
    <div className="mb-4 flex gap-2">
      <button
        className={`px-4 py-2 rounded ${activeTab === "webhooks" ? "bg-brand-blue text-white" : "bg-gray-100"}`}
        onClick={() => setActiveTab("webhooks")}
      >
        Webhooks & n8n
      </button>
      <button
        className={`px-4 py-2 rounded ${activeTab === "twilio" ? "bg-brand-blue text-white" : "bg-gray-100"}`}
        onClick={() => setActiveTab("twilio")}
      >
        Twilio WhatsApp
      </button>
    </div>
  );
}
