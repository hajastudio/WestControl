
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type AddressFields = {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
};

const mockViaCepFetch = async (cep: string) => {
  // Simula uma resposta da API ViaCEP
  return {
    street: "Rua das Flores",
    neighborhood: "Centro",
    city: "Cidade Exemplo",
    state: "EX",
  };
};

export function AddressAutoFillExample() {
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { isValid, errors },
  } = useForm<AddressFields>({
    mode: "onChange", // Ativa validação em tempo real
    defaultValues: {
      cep: "",
      street: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  const cep = watch("cep");

  const handleCepBlur = async () => {
    if (cep && cep.replace(/\D/g, "").length === 8) {
      // Busca endereço na mock API (troque por chamada real ao ViaCEP)
      const address = await mockViaCepFetch(cep);
      // Preenche todos os campos + valida
      setValue("street", address.street, { shouldValidate: true });
      setValue("neighborhood", address.neighborhood, { shouldValidate: true });
      setValue("city", address.city, { shouldValidate: true });
      setValue("state", address.state, { shouldValidate: true });
    }
  };

  return (
    <form
      onSubmit={handleSubmit((data) => alert("Endereço enviado!"))}
      className="space-y-4 max-w-md mx-auto"
    >
      <Input
        {...register("cep", { required: "Digite o CEP" })}
        placeholder="CEP"
        maxLength={9}
        onBlur={handleCepBlur}
      />
      {errors.cep && <span className="text-red-500 text-xs">{errors.cep.message}</span>}

      <Input
        {...register("street", { required: "Preencha a rua" })}
        placeholder="Rua"
      />
      {errors.street && <span className="text-red-500 text-xs">{errors.street.message}</span>}

      <Input
        {...register("neighborhood", { required: "Preencha o bairro" })}
        placeholder="Bairro"
      />
      {errors.neighborhood && <span className="text-red-500 text-xs">{errors.neighborhood.message}</span>}

      <Input
        {...register("city", { required: "Preencha a cidade" })}
        placeholder="Cidade"
      />
      {errors.city && <span className="text-red-500 text-xs">{errors.city.message}</span>}

      <Input
        {...register("state", { required: "Preencha o estado" })}
        placeholder="Estado"
        maxLength={2}
      />
      {errors.state && <span className="text-red-500 text-xs">{errors.state.message}</span>}

      <Button type="submit" className="w-full" disabled={!isValid}>
        Continuar
      </Button>
    </form>
  );
}

export default AddressAutoFillExample;
