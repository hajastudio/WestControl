
export interface FormData {
  name: string;
  email: string;
  whatsapp: string;
  cep: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  number?: string;
  complement?: string;
  reference?: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  planName?: string;
  planType?: string;
}

export interface PlanDetails {
  name: string;
  speed: string;
  price: string;
  benefits: string[];
  type: string;
}
