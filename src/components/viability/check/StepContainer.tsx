
import React from "react";
import { LeadCapture } from "@/components/viability/LeadCapture";
import { CepCheck } from "@/components/viability/CepCheck";
import { AddressForm } from "@/components/viability/AddressForm";
import { WaitlistOption } from "@/components/viability/WaitlistOption";
import type { LeadData, PlanData } from "./useViabilityStepper";

interface StepContainerProps {
  currentStep: number;
  isLoading: boolean;
  leadData: LeadData;
  planData: PlanData | null;
  cepIsViable: boolean | null;
  handleLeadCapture: (data: {
    name: string;
    email: string;
    whatsapp: string;
    planType: string;
    businessType?: string;
  }) => void;
  handleCepCheck: (
    cep: string,
    isViable: boolean,
    addressData?: any
  ) => void;
  handleAddressSubmit: (data: {
    number: string;
    complement: string;
    reference: string;
    cpf: string;
    rg: string;
    birthDate: string;
  }) => void;
  handleWaitlistJoin: () => void;
  handleDeclineWaitlist: () => void;
}

export const StepContainer: React.FC<StepContainerProps> = ({
  currentStep,
  isLoading,
  leadData,
  planData,
  cepIsViable,
  handleLeadCapture,
  handleCepCheck,
  handleAddressSubmit,
  handleWaitlistJoin,
  handleDeclineWaitlist,
}) => {
  return (
    <div className="space-y-6">
      {currentStep === 1 && (
        <LeadCapture
          onSubmit={handleLeadCapture}
          isLoading={isLoading}
          initialData={{
            name: leadData.name,
            email: leadData.email,
            whatsapp: leadData.whatsapp,
            planType: leadData.planType,
            businessType: leadData.businessType,
          }}
          planData={planData || undefined}
        />
      )}

      {currentStep === 2 && (
        <CepCheck
          onSubmit={handleCepCheck}
          isLoading={isLoading}
          initialData={{
            cep: leadData.cep,
          }}
        />
      )}

      {currentStep === 3 && cepIsViable && (
        <AddressForm
          onSubmit={handleAddressSubmit}
          isLoading={isLoading}
          addressData={{
            street: leadData.street,
            neighborhood: leadData.neighborhood,
            city: leadData.city,
            state: leadData.state,
          }}
        />
      )}

      {currentStep === 3 && cepIsViable === false && (
        <WaitlistOption
          onJoin={handleWaitlistJoin}
          onDecline={handleDeclineWaitlist}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};
