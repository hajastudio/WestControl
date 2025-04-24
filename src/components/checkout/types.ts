
import type { PlanData } from "@/components/viability/check/useViabilityStepper";

export type Step = 1 | 2 | 3 | 4 | 5;

export interface FormData {
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
  cpf?: string;
  rg?: string;
  birthDate?: string;
}

export interface CheckoutProps {
  plan: PlanData;
  onClose: () => void;
  businessType?: "residential" | "semi" | "dedicated";
}
