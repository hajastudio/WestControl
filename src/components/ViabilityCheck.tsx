
import React from "react";
import { Container } from "@/components/ui/container";
import { useNavigate } from "react-router-dom";
import { useViabilityStepper, LeadData } from "@/components/viability/check/useViabilityStepper";
import { NotificationHandler } from "@/components/viability/check/NotificationHandler";
import { StepContainer } from "@/components/viability/check/StepContainer";

const EMPTY_LEAD_DATA: LeadData = {
  name: "",
  email: "",
  whatsapp: "",
  planType: "residential",
  businessType: "",
  cep: "",
  street: "",
  neighborhood: "",
  city: "",
  state: "",
  number: "",
  complement: "",
  reference: "",
  cpf: "",
  rg: "",
  birthDate: "",
};

export function ViabilityCheck() {
  const navigate = useNavigate();
  const {
    currentStep,
    leadData,
    planData,
    isLoading,
    cepIsViable,
    notification,
    hideNotification,
    handleLeadCapture,
    handleCepCheck,
    handleAddressSubmit,
    handleWaitlistJoin,
  } = useViabilityStepper(EMPTY_LEAD_DATA);

  return (
    <div className="py-12 bg-brand-gray/30">
      <Container>
        <div className="max-w-2xl mx-auto bg-white backdrop-blur-sm bg-opacity-80 rounded-2xl shadow-xl border border-[#2b24a3]/30 p-8">
          <NotificationHandler
            notification={notification}
            onClose={hideNotification}
          />

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Verificação de Viabilidade</h2>
            <p className="text-gray-600">
              Verifique se nossos serviços estão disponíveis na sua região
            </p>
          </div>
          <StepContainer
            currentStep={currentStep}
            isLoading={isLoading}
            leadData={leadData}
            planData={planData}
            cepIsViable={cepIsViable}
            handleLeadCapture={handleLeadCapture}
            handleCepCheck={handleCepCheck}
            handleAddressSubmit={handleAddressSubmit}
            handleWaitlistJoin={handleWaitlistJoin}
            handleDeclineWaitlist={() => navigate("/")}
          />
        </div>
      </Container>
    </div>
  );
}

export default ViabilityCheck;
