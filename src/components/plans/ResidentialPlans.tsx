
import React from "react";
import { PlanCard } from "./PlanCard";
import { PlanData } from "@/components/viability/check/useViabilityStepper";

interface ResidentialPlansProps {
  onPlanSelect: (plan: PlanData) => void;
}

export const RESIDENTIAL_PLANS = [
  {
    name: "Standard 500 MEGA",
    speed: "500 MEGA",
    price: "R$ 99,90",
    tagline: "Conexão confiável para o dia a dia",
    description: "Ideal para navegação, streaming e conectar diversos dispositivos com estabilidade e segurança.",
    benefits: [
      "Instalação grátis em 24h",
      "Paramount+ incluso",
      "Watch TV grátis",
      "Wi-Fi Turbo grátis",
      "SLA 24h"
    ]
  },
  {
    name: "Advanced 700 MEGA",
    speed: "700 MEGA",
    price: "R$ 129,90",
    tagline: "Mais velocidade para múltiplos dispositivos",
    description: "Perfeito para famílias que usam muitos dispositivos simultaneamente sem perda de desempenho.",
    benefits: [
      "Instalação grátis em 24h",
      "Paramount+ incluso",
      "Watch TV grátis",
      "Wi-Fi 6 grátis",
      "SLA 12h",
      "Suporte prioritário"
    ]
  },
  {
    name: "Premium 1000 MEGA",
    speed: "1000 MEGA",
    price: "R$ 149,90",
    tagline: "Para quem exige tudo — sem limites",
    description: "Experiência definitiva em conectividade para quem precisa do máximo em velocidade e estabilidade.",
    benefits: [
      "Instalação expressa grátis",
      "Paramount+ incluso",
      "Watch TV grátis",
      "Wi-Fi 6 grátis",
      "SLA 8h",
      "Suporte VIP 24/7",
      "IP Fixo opcional"
    ],
    recommended: true
  }
];

export function ResidentialPlans({ onPlanSelect }: ResidentialPlansProps) {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-6 text-center text-[#2b24a3] flex items-center justify-center">
        <span className="text-blue-600 mr-2">🔵</span> Para Você
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {RESIDENTIAL_PLANS.map((plan) => (
          <PlanCard
            key={plan.name}
            {...plan}
            planType="residential"
            onSelect={() => onPlanSelect({
              name: plan.name,
              speed: plan.speed,
              price: plan.price
            })}
          />
        ))}
      </div>
    </div>
  );
}
