import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlanData } from "@/components/viability/check/useViabilityStepper";
import { StepIndicator } from "./StepIndicator";
import { useOnepageCheckout } from "./useOnepageCheckout";
import { OnepagePersonalForm } from "./OnepagePersonalForm";
import { OnepageAddressCheck } from "./OnepageAddressCheck";
import { OnepageFinalize } from "./OnepageFinalize";
import { UpgradeOffer } from "./UpgradeOffer";
import { FinalVerification } from "./FinalVerification";
import { CountdownTimer } from "./CountdownTimer";

interface OnepageCheckoutProps {
  plan: PlanData;
  onClose: () => void;
}

export function OnepageCheckout({ plan, onClose }: OnepageCheckoutProps) {
  const checkout = useOnepageCheckout({ 
    plan, 
    onClose,
    businessType: plan.businessType || "residential"
  });

  return (
    <Dialog open={true} onOpenChange={() => !checkout.isLoading && onClose()}>
      <DialogContent 
        className="max-w-2xl overflow-auto max-h-[90vh] glassmorphism-card border border-neon"
        aria-describedby="checkout-description"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2 flex items-center justify-center gap-2">
            {checkout.step === 1 && "Contratação de Plano"}
            {checkout.step === 2 && "Verificação de Endereço"}
            {checkout.step === 3 && "Oferta Especial"}
            {checkout.step === 4 && "Seus Dados"}
            {checkout.step === 5 && (checkout.cepViable ? "Finalizar Contratação" : "Lista de Espera")}
          </DialogTitle>
          <p id="checkout-description" className="sr-only">
            Formulário de contratação de plano de internet
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
            disabled={checkout.isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="p-2">
          <CountdownTimer />

          <div className="bg-brand-blue/10 p-4 rounded-lg mb-6">
            <h3 className="font-bold text-lg mb-1">Plano selecionado:</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xl font-semibold">{checkout.upgradedPlan?.name || plan.name}</p>
                <p className="text-gray-600">Velocidade: {checkout.upgradedPlan?.speed || plan.speed}</p>
              </div>
              <div className="text-xl font-bold text-brand-blue">
                {checkout.upgradedPlan?.price || plan.price}<span className="text-sm text-gray-500">/mês</span>
              </div>
            </div>
          </div>

          <StepIndicator step={checkout.step} />

          {checkout.step === 1 && (
            <OnepagePersonalForm
              formData={checkout.formData}
              onChange={checkout.handleInputChange}
              onSubmit={checkout.handleStep1Submit}
              isLoading={checkout.isLoading}
            />
          )}

          {checkout.step === 2 && (
            <OnepageAddressCheck
              formData={checkout.formData}
              onChange={checkout.handleInputChange}
              fetchAddress={checkout.fetchAddress}
              onCepBlur={() => checkout.handleCepBlur(checkout.formData.cep)}
              cepChecking={checkout.cepChecking}
              cepError={checkout.cepError}
              cepViable={checkout.cepViable}
              setStep={checkout.setStep}
              isLoading={checkout.isLoading}
              handleJoinWaitlist={checkout.handleJoinWaitlist}
              onSubmit={checkout.handleAddressSubmit}
            />
          )}

          {checkout.step === 3 && (
            <UpgradeOffer
              currentPlan={plan}
              onUpgrade={checkout.handleUpgrade}
              onSkip={checkout.handleSkipUpgrade}
              isLoading={checkout.isLoading}
            />
          )}

          {checkout.step === 4 && (
            <FinalVerification
              formData={checkout.formData}
              onChange={checkout.handleInputChange}
              onSubmit={checkout.handlePersonalSubmit}
              onBack={() => checkout.setStep(3)}
              isLoading={checkout.isLoading}
            />
          )}

          {checkout.step === 5 && checkout.cepViable && (
            <OnepageFinalize
              formData={checkout.formData}
              onChange={checkout.handleInputChange}
              onFinalize={checkout.handleFinalizarCadastro}
              isLoading={checkout.isLoading}
              setStep={checkout.setStep}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
