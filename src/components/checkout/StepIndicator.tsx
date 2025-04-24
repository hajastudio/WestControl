
import React from "react";
import { Check, ChevronRight } from "lucide-react";

interface StepIndicatorProps {
  step: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ step }) => (
  <div className="flex items-center justify-center gap-4 mb-6">
    {[1, 2, 3].map((n) => (
      <div key={n} className="flex items-center">
        <div
          className={`h-9 w-9 rounded-full flex items-center justify-center text-lg font-bold 
            ${step === n ? "bg-brand-blue text-white" : "bg-gray-200 text-brand-blue border border-brand-blue"}`}
        >
          {step > n ? <Check size={22} /> : n}
        </div>
        {n !== 3 && <ChevronRight className="mx-2 text-brand-blue" />}
      </div>
    ))}
  </div>
);
