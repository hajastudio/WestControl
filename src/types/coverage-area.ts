
export interface CoverageAreaType {
  id: string;
  cep: string;
  rua: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  /** Data de criação do registro */
  created_at: string | null;
}
