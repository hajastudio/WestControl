
import React from "react";
import { Container } from "@/components/ui/container";
import { AddressStep } from "./completion-form/AddressStep";
import { PersonalStep } from "./completion-form/PersonalStep";
import { SummaryStep } from "./completion-form/SummaryStep";
import { useCompletionForm } from "./completion-form/useCompletionForm";

export function CompletionForm() {
  const {
    step,
    setStep,
    leadData,
    addressData,
    personalData,
    errors,
    handleLeadFormChange,
    handleAddressChange,
    handlePersonalChange,
    handleLeadSubmit,
    handleAddressSubmit,
    handlePersonalSubmit,
    isSubmitting
  } = useCompletionForm();

  // Função auxiliar para renderizar a timeline de etapas
  function renderTimeline() {
    // step = 1: dados de contato
    // step = 2: endereço
    // step = 3: pessoal + confirmação
    const activeStep = step;
    const stepsInfo = [
      { label: "Contato", id: 1 },
      { label: "Endereço", id: 2 },
      { label: "Confirmação", id: 3 },
    ];
    return (
      <div className="flex items-center justify-center mt-6 mb-10">
        <div className="flex items-center space-x-4">
          {stepsInfo.map((stepData, idx) => (
            <React.Fragment key={stepData.id}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${activeStep === stepData.id
                ? "bg-brand-blue text-white"
                : activeStep > stepData.id
                  ? "bg-brand-blue/80 text-white"
                  : "bg-gray-300 text-gray-600"
                }`}>
                {stepData.id}
              </div>
              {idx !== stepsInfo.length - 1 && (
                <div className={`w-20 h-1 ${activeStep > stepData.id
                  ? "bg-brand-blue"
                  : "bg-gray-300"
                  }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-brand-gray/30">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-2">
              <h2 className="text-3xl font-bold mb-2">Estamos quase lá!</h2>
              <p className="text-gray-600">
                Complete seu cadastro para finalizarmos seu pedido
              </p>
            </div>
            {renderTimeline()}

            {step === 1 && (
              <form onSubmit={handleLeadSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="font-medium">Nome Completo<span className="text-red-500">*</span></label>
                  <input
                    id="name"
                    name="name"
                    className={`w-full border rounded-md px-3 py-2 ${errors.name ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Digite seu nome completo"
                    value={leadData.name || ""}
                    onChange={handleLeadFormChange}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="font-medium">E-mail<span className="text-red-500">*</span></label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`w-full border rounded-md px-3 py-2 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Digite seu e-mail"
                    value={leadData.email || ""}
                    onChange={handleLeadFormChange}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="whatsapp" className="font-medium">WhatsApp<span className="text-red-500">*</span></label>
                  <input
                    id="whatsapp"
                    name="whatsapp"
                    className={`w-full border rounded-md px-3 py-2 ${errors.whatsapp ? "border-red-500" : "border-gray-300"}`}
                    placeholder="(00) 00000-0000"
                    value={leadData.whatsapp || ""}
                    onChange={handleLeadFormChange}
                  />
                  {errors.whatsapp && <p className="text-red-500 text-sm">{errors.whatsapp}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white rounded-md font-semibold py-3"
                >Continuar</button>
              </form>
            )}

            {step === 2 && (
              <AddressStep
                leadData={leadData}
                addressData={addressData}
                errors={errors}
                onChange={handleAddressChange}
                onSubmit={handleAddressSubmit}
              />
            )}

            {step === 3 && (
              <PersonalStep
                personalData={personalData}
                errors={errors}
                onChange={handlePersonalChange}
                onBack={() => setStep(2)}
                onSubmit={handlePersonalSubmit}
                isSubmitting={isSubmitting}
              />
            )}

            {step === 4 && (
              <SummaryStep
                leadData={leadData}
                addressData={addressData}
                personalData={personalData}
                onBack={() => setStep(3)}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default CompletionForm;
