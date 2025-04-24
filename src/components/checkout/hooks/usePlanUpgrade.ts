
import { useState } from "react";
import type { PlanData } from "@/components/viability/check/useViabilityStepper";

export const usePlanUpgrade = () => {
  const [upgradedPlan, setUpgradedPlan] = useState<PlanData | null>(null);

  const handleUpgrade = (plan: PlanData) => {
    const upgradedSpeed = parseInt(plan.speed) + 200;
    const originalPrice = parseFloat(plan.price.replace('R$ ', '').replace(',', '.'));
    const discountedPrice = (originalPrice + 20).toFixed(2);
    
    setUpgradedPlan({
      ...plan,
      name: `${plan.name} PLUS`,
      speed: `${upgradedSpeed} MEGA`,
      price: `R$ ${discountedPrice}`
    });
  };

  return {
    upgradedPlan,
    setUpgradedPlan,
    handleUpgrade,
  };
};
