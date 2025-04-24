
import React from "react";
import { PlanCard } from "./PlanCard";
import { PlanData } from "@/components/viability/check/useViabilityStepper";

interface DedicatedPlansProps {
  onPlanSelect: (plan: PlanData) => void;
}

export const DEDICATED_PLANS = [
  {
    name: "Silver 300 MEGA",
    speed: "300 MEGA",
    price: "R$ 799,90",
    tagline: "Conexão dedicada para pequenas operações",
    description: "Link dedicado para operações empresariais que exigem estabilidade garantida e suporte especializado.",
    benefits: [
      "Full Duplex",
      "IP Fixo incluso",
      "99.9% garantia",
      "100% download/upload",
      "Monitoramento 24/7",
      "Fidelidade 24 meses"
    ]
  },
  {
    name: "Gold 500 MEGA",
    speed: "500 MEGA",
    price: "R$ 999,90",
    tagline: "Performance dedicada para médias empresas",
    description: "Solução profissional para empresas que precisam de conectividade 100% garantida e velocidade simétrica.",
    benefits: [
      "Full Duplex",
      "IP Fixo incluso",
      "99.9% garantia",
      "100% download/upload",
      "Monitoramento 24/7",
      "Fidelidade 24 meses"
    ]
  },
  {
    name: "Platinum 1000 MEGA",
    speed: "1000 MEGA",
    price: "R$ 1499,90",
    tagline: "Solução avançada para empresas exigentes",
    description: "Para operações críticas que exigem alta disponibilidade e desempenho garantido em tempo integral.",
    benefits: [
      "Full Duplex",
      "IP Fixo incluso",
      "99.9% garantia",
      "100% download/upload",
      "Monitoramento 24/7",
      "Fidelidade 24 meses"
    ]
  },
  {
    name: "Diamond 2000 MEGA",
    speed: "2000 MEGA",
    price: "R$ 2499,90",
    tagline: "Alta Performance Corporativa",
    description: "O padrão ouro em conectividade corporativa, para empresas que não podem comprometer desempenho.",
    benefits: [
      "Full Duplex",
      "IP Fixo incluso",
      "99.9% garantia",
      "100% download/upload",
      "Monitoramento 24/7",
      "Fidelidade 24 meses",
      "Suporte dedicado"
    ],
    recommended: true
  }
];

export function DedicatedPlans({ onPlanSelect }: DedicatedPlansProps) {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-6 text-center text-[#db451c] flex items-center justify-center">
        <span className="text-red-600 mr-2">🔴</span> Para Seu Negócio – Dedicado
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {DEDICATED_PLANS.map((plan) => (
          <PlanCard
            key={plan.name}
            {...plan}
            businessType="dedicated"
            planType="dedicated"
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
