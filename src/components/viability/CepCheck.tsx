
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCep } from "@/utils/cepUtils";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface CepCheckProps {
  onSubmit: (cep: string, isViable: boolean, addressData?: any) => void;
  isLoading: boolean;
  initialData?: {
    cep: string;
  };
}

export const CepCheck: React.FC<CepCheckProps> = ({
  onSubmit,
  isLoading,
  initialData = { cep: "" },
}) => {
  const [cep, setCep] = useState(initialData.cep);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCep = formatCep(e.target.value);
    setCep(formattedCep);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate CEP format
    const normalizedCep = cep.replace(/\D/g, "");
    if (normalizedCep.length !== 8) {
      setError("CEP inválido. Digite um CEP no formato 00000-000");
      return;
    }
    
    setChecking(true);
    try {
      // Query Supabase for CEP viability
      const { data: viabilityData, error: viabilityError } = await supabase
        .from("viability")
        .select("*")
        .eq("cep", normalizedCep)
        .maybeSingle();

      if (viabilityError) throw viabilityError;

      // If we have the CEP in our database
      if (viabilityData) {
        const addressData = {
          street: viabilityData.street || "",
          neighborhood: viabilityData.neighborhood || "",
          city: viabilityData.city || "",
          state: viabilityData.state || "",
        };
        
        onSubmit(cep, viabilityData.is_viable, addressData);
        return;
      }

      // If not in our database, check with ViaCEP and mock viability (even CEPs are viable)
      const response = await fetch(`https://viacep.com.br/ws/${normalizedCep}/json/`);
      const addressData = await response.json();
      
      if (addressData.erro) {
        setError("CEP não encontrado. Verifique se digitou corretamente.");
        setChecking(false);
        return;
      }
      
      // Mock viability check (even numbers are viable)
      const isViable = parseInt(normalizedCep.slice(-1)) % 2 === 0;
      
      // Submit the result
      onSubmit(cep, isViable, {
        street: addressData.logradouro || "",
        neighborhood: addressData.bairro || "",
        city: addressData.localidade || "",
        state: addressData.uf || "",
      });
    } catch (error) {
      console.error("Error checking viability:", error);
      setError("Ocorreu um erro ao verificar a viabilidade. Tente novamente.");
      setChecking(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="cep">Digite seu CEP<span className="text-red-500">*</span></Label>
        <Input
          id="cep"
          placeholder="00000-000"
          value={cep}
          onChange={handleChange}
          className={error ? "border-red-500" : ""}
          maxLength={9}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      
      <button
        type="submit"
        className="w-full bg-[#db451c] hover:bg-[#db451c]/90 text-white py-3 rounded-md font-medium transition-colors flex justify-center items-center"
        disabled={isLoading || checking}
      >
        {isLoading || checking ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            Verificando...
          </>
        ) : (
          "Verificar Disponibilidade"
        )}
      </button>
      
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Não sabe seu CEP? <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">Consulte aqui</a>
        </p>
      </div>
    </form>
  );
};
