
import { RESIDENTIAL_PLANS } from "@/components/plans/ResidentialPlans";
import { SEMI_DEDICATED_PLANS } from "@/components/plans/SemiDedicatedPlans";
import { DEDICATED_PLANS } from "@/components/plans/DedicatedPlans";
import type { PlanDetails } from "@/types/viability";

export const getPlanDetails = (planName: string): PlanDetails | null => {
  const allPlans = [
    ...RESIDENTIAL_PLANS.map(plan => ({ ...plan, type: "residential" })),
    ...SEMI_DEDICATED_PLANS.map(plan => ({ ...plan, type: "semi" })),
    ...DEDICATED_PLANS.map(plan => ({ ...plan, type: "dedicated" }))
  ];

  const planNameOnly = planName.split(" ")[0];
  
  let plan = allPlans.find(p => p.name === planName);
  
  if (!plan) {
    plan = allPlans.find(p => p.name === planNameOnly);
  }
  
  if (!plan) {
    plan = allPlans.find(p => planName.includes(p.name));
  }
  
  return plan || null;
};
