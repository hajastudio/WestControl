
import React, { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { useViabilityCheck } from "@/hooks/useViabilityCheck";
import { getPlanDetails } from "@/utils/planUtils";
import { PlanDetailsCard } from "@/components/viability/PlanDetailsCard";
import { ViabilityForm } from "@/components/viability/ViabilityForm";
import type { PlanDetails } from "@/types/viability";

interface ViabilityCheckerProps {
  selectedPlan: string;
}

const ViabilityChecker: React.FC<ViabilityCheckerProps> = ({ selectedPlan }) => {
  const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);
  const { formData, isLoading, isViable, addressLoaded, error, handleInputChange, handleSubmit } = useViabilityCheck(selectedPlan);
  
  useEffect(() => {
    if (selectedPlan) {
      const details = getPlanDetails(selectedPlan);
      setPlanDetails(details);
    }
  }, [selectedPlan]);

  return (
    <div className="py-12 bg-brand-gray/30">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Verificar Viabilidade</h1>
            <p className="text-gray-600">Confira se atendemos sua região para o plano selecionado</p>
          </div>

          <PlanDetailsCard planDetails={planDetails} />

          <ViabilityForm
            formData={formData}
            isViable={isViable}
            isLoading={isLoading}
            addressLoaded={addressLoaded}
            error={error}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </div>
      </Container>
    </div>
  );
};

export default ViabilityChecker;
