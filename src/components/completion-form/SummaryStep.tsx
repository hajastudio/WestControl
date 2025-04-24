
import React from "react";

interface SummaryStepProps {
  leadData: {
    name: string;
    email: string;
    whatsapp: string;
    street?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    cep?: string;
  };
  addressData: {
    number: string;
    complement: string;
    reference: string;
  };
  personalData: {
    cpf: string;
    rg: string;
    birthDate: string;
  };
  onBack: () => void;
  isSubmitting: boolean;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({
  leadData,
  addressData,
  personalData,
  onBack,
  isSubmitting,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-center mb-6">Confirme seus dados</h3>
      <div className="bg-brand-gray/20 p-4 rounded-lg">
        <div className="space-y-2 text-sm">
          <div>
            <strong>Nome:</strong> {leadData.name}
          </div>
          <div>
            <strong>E-mail:</strong> {leadData.email}
          </div>
          <div>
            <strong>WhatsApp:</strong> {leadData.whatsapp}
          </div>
          <div>
            <strong>Endereço:</strong> {leadData.street}, {addressData.number}
          </div>
          <div>
            <strong>Bairro:</strong> {leadData.neighborhood}
          </div>
          <div>
            <strong>Cidade/UF:</strong> {leadData.city} - {leadData.state}
          </div>
          <div>
            <strong>CEP:</strong> {leadData.cep}
          </div>
          <div>
            <strong>Complemento:</strong> {addressData.complement}
          </div>
          <div>
            <strong>Ponto de Referência:</strong> {addressData.reference}
          </div>
          <div>
            <strong>CPF:</strong> {personalData.cpf}
          </div>
          <div>
            <strong>RG:</strong> {personalData.rg}
          </div>
          <div>
            <strong>Data de Nascimento:</strong> {personalData.birthDate}
          </div>
        </div>
      </div>
      <div className="flex gap-4 justify-between">
        <button
          type="button"
          className="flex-1 border border-brand-blue text-brand-blue rounded-md py-3 font-medium hover:bg-brand-blue/10"
          onClick={onBack}
        >
          Voltar
        </button>
        <button
          type="submit"
          className="flex-1 bg-brand-blue text-white rounded-md py-3 font-medium hover:bg-brand-blue/90"
          disabled={isSubmitting}
          id="finaliza-cadastro"
          form="personal-form"
        >
          {isSubmitting ? "Finalizando..." : "Confirmar e Concluir"}
        </button>
      </div>
    </div>
  );
};
