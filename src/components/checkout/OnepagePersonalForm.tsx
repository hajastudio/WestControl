import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import type { FormData } from "./types";

interface Props {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function OnepagePersonalForm({ formData, onChange, onSubmit, isLoading }: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 py-4">
      <div>
        <Label htmlFor="name">Nome completo<span className="text-red-500">*</span></Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder="Digite seu nome completo"
          required
        />
      </div>
      <div>
        <Label htmlFor="email">E-mail<span className="text-red-500">*</span></Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          placeholder="seu@email.com"
          required
        />
      </div>
      <div>
        <Label htmlFor="whatsapp">WhatsApp<span className="text-red-500">*</span></Label>
        <Input
          id="whatsapp"
          name="whatsapp"
          value={formData.whatsapp}
          onChange={onChange}
          placeholder="(00) 00000-0000"
          required
        />
      </div>
      <div className="pt-4">
        <Button
          type="submit"
          className="w-full bg-brand-blue hover:bg-brand-blue/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            "Continuar"
          )}
        </Button>
      </div>
    </form>
  );
}
