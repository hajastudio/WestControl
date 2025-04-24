
import React from "react";
import { PlanCard } from "./PlanCard";
import { PlanData } from "@/components/viability/check/useViabilityStepper";

interface SemiDedicatedPlansProps {
  onPlanSelect: (plan: PlanData) => void;
}

export const SEMI_DEDICATED_PLANS = [
  {
    name: "Standard 300 MEGA",
    speed: "300 MEGA",
    price: "R$ 299,90",
    tagline: "Solução empresarial de acesso confiável",
    description: "Ideal para pequenos escritórios, lojas e operações comerciais que exigem estabilidade.",
    benefits: [
      "IP Fixo incluso",
      "50% upload garantido",
      "50% garantia de banda",
      "SLA 12h",
      "Fidelidade 12 meses"
    ]
  },
  {
    name: "PRO 500 MEGA",
    speed: "500 MEGA",
    price: "R$ 399,90",
    tagline: "Para empresas em crescimento",
    description: "Perfeito para empresas e e-commerces que dependem de conexão estável para suas operações diárias.",
    benefits: [
      "IP Fixo incluso",
      "50% upload garantido",
      "50% garantia de banda",
      "SLA 8h",
      "Fidelidade 12 meses",
      "Suporte prioritário"
    ]
  },
  {
    name: "ULTRA 700 MEGA",
    speed: "700 MEGA",
    price: "R$ 599,90",
    tagline: "Máxima performance para seu negócio",
    description: "Solução robusta para negócios que exigem alta disponibilidade e performance constante.",
    benefits: [
      "IP Fixo incluso",
      "50% upload garantido",
      "50% garantia de banda",
      "SLA 8h",
      "Fidelidade 12 meses",
      "Suporte VIP"
    ]
  }
];

export function SemiDedicatedPlans({ onPlanSelect }: SemiDedicatedPlansProps) {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-6 text-center text-[#db451c] flex items-center justify-center">
        <span className="text-orange-500 mr-2">🟠</span> Para Seu Negócio – Semi-Dedicado
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {SEMI_DEDICATED_PLANS.map((plan) => (
          <PlanCard
            key={plan.name}
            {...plan}
            businessType="semi"
            planType="semi-dedicated"
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
