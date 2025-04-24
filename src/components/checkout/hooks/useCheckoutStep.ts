
import { useState } from "react";
import type { Step } from "../types";

export const useCheckoutStep = () => {
  const [step, setStep] = useState<Step>(1);

  return {
    step,
    setStep,
  };
};
