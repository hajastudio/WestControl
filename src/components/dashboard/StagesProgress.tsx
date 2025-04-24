
import React from 'react';
import { CircleCheck, CircleDot, CircleArrowDown } from "lucide-react";

interface StagesProgressProps {
  currentStatus: string;
}

const LEAD_STAGES = [
  "Cadastro recebido",
  "Viabilidade técnica confirmada", 
  "Dados complementares enviados", 
  "Aguardando aprovação", 
  "Instalação em andamento", 
  "Concluído"
];

export const StagesProgress = ({ currentStatus }: StagesProgressProps) => {
  const getCurrentStageIndex = () => {
    const statusMap: { [key: string]: number } = {
      'pendente': 0,
      'viavel': 1,
      'aguardando_documentos': 2,
      'em_analise': 3,
      'aprovado': 4,
      'concluido': 5
    };
    return statusMap[currentStatus] || 0;
  };

  const renderStatusIcon = (stage: string, index: number) => {
    const currentStageIndex = getCurrentStageIndex();
    
    if (index < currentStageIndex) return <CircleCheck color="green" />;
    if (index === currentStageIndex) return <CircleDot color="blue" />;
    return <CircleArrowDown color="gray" />;
  };

  return (
    <div>
      <h2 className="font-bold mb-4">Etapas do Processo</h2>
      {LEAD_STAGES.map((stage, index) => (
        <div 
          key={stage} 
          className={`flex items-center mb-2 ${
            index === getCurrentStageIndex() ? 'font-bold' : ''
          }`}
        >
          {renderStatusIcon(stage, index)}
          <span className="ml-2">{stage}</span>
        </div>
      ))}
    </div>
  );
};
