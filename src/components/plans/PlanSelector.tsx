
import React, { useState } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ResidentialPlans } from "./ResidentialPlans";
import { SemiDedicatedPlans } from "./SemiDedicatedPlans";
import { DedicatedPlans } from "./DedicatedPlans";
import { PlanData } from "@/components/viability/check/useViabilityStepper";

interface PlanSelectorProps {
  onPlanSelect: (plan: PlanData) => void;
}

export function PlanSelector({ onPlanSelect }: PlanSelectorProps) {
  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 bg-[#efeef6]" />
      <Container className="relative">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#2b24a3]">
            Escolha seu Plano
          </h2>
          <p className="text-gray-600 text-lg">
            Selecione a opção que melhor atende às suas necessidades
          </p>
        </div>

        <Tabs defaultValue="residential" className="w-full">
          <TabsList className="grid w-full max-w-xl mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="residential">Residencial</TabsTrigger>
            <TabsTrigger value="semi">Semi-Dedicado</TabsTrigger>
            <TabsTrigger value="dedicated">Dedicado</TabsTrigger>
          </TabsList>
          <TabsContent value="residential" className="animate-fade-in">
            <ResidentialPlans onPlanSelect={onPlanSelect} />
          </TabsContent>
          <TabsContent value="semi" className="animate-fade-in">
            <SemiDedicatedPlans onPlanSelect={onPlanSelect} />
          </TabsContent>
          <TabsContent value="dedicated" className="animate-fade-in">
            <DedicatedPlans onPlanSelect={onPlanSelect} />
          </TabsContent>
        </Tabs>
      </Container>
    </section>
  );
}
