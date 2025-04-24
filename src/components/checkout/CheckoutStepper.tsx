import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatPhone, formatCep, formatCpf } from "@/utils/cepUtils";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Check, ChevronRight, ChevronLeft } from "lucide-react";
import { StepIndicator } from "./StepIndicator";
import { StepPersonalInfo } from "./StepPersonalInfo";
import { StepCepCheck } from "./StepCepCheck";
import { StepAddressInfo } from "./StepAddressInfo";

type Step = 1 | 2 | 3;

interface FormData {
  name: string;
  email: string;
  whatsapp: string;
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  number: string;
  complement: string;
  reference: string;
  cpf: string;
  rg: string;
  birthDate: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  whatsapp: "",
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

export function CheckoutStepper() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<any>(initialFormData);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cepViable, setCepViable] = useState<boolean | null>(null);
  const [successMsg, setSuccessMsg] = useState<string>("");

  return (
    <div className="max-w-lg mx-auto mb-12 mt-4 bg-white rounded-2xl shadow-xl border border-brand-blue/10 p-6">
      {step === 1 && (
        <StepPersonalInfo
          formData={formData}
          setFormData={setFormData}
          setStep={setStep}
          setLeadId={setLeadId}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          supabase={supabase}
        />
      )}
      {step === 2 && (
        <StepCepCheck
          formData={formData}
          setFormData={setFormData}
          step={step}
          setStep={setStep}
          leadId={leadId}
          setCepViable={setCepViable}
          cepViable={cepViable}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          setLeadId={setLeadId}
          supabase={supabase}
          setSuccessMsg={setSuccessMsg}
        />
      )}
      {step === 3 && (
        <StepAddressInfo
          formData={formData}
          setFormData={setFormData}
          setStep={setStep}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          leadId={leadId}
          supabase={supabase}
          successMsg={successMsg}
          setSuccessMsg={setSuccessMsg}
          setCepViable={setCepViable}
          setLeadId={setLeadId}
        />
      )}
    </div>
  );
}

export default CheckoutStepper;
