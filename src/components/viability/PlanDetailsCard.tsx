
import React from "react";
import type { PlanDetails } from "@/types/viability";

interface PlanDetailsCardProps {
  planDetails: PlanDetails | null;
}

export const PlanDetailsCard: React.FC<PlanDetailsCardProps> = ({ planDetails }) => {
  if (!planDetails) {
    return (
      <div className="mb-8 bg-yellow-50 p-6 rounded-xl shadow border border-yellow-200">
        <p className="text-yellow-700">Nenhum plano foi selecionado ou o plano não foi encontrado.</p>
      </div>
    );
  }

  return (
    <div className="mb-8 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-brand-blue">Plano Selecionado</h2>
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">{planDetails.name}</h3>
          <p className="text-xl font-semibold text-brand-blue">{planDetails.speed}</p>
          <p className="text-lg font-medium">{planDetails.price}/mês</p>
        </div>
        <div className="mt-4 md:mt-0">
          <h4 className="text-lg font-semibold mb-2">Benefícios</h4>
          <ul className="space-y-1">
            {planDetails.benefits.slice(0, 3).map((benefit: string, index: number) => (
              <li key={index} className="flex items-center text-sm">
                <span className="text-brand-red mr-2">✓</span> {benefit}
              </li>
            ))}
            {planDetails.benefits.length > 3 && (
              <li className="text-sm text-gray-500">+ {planDetails.benefits.length - 3} outros benefícios</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
