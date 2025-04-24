
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { EntertainmentSection } from "@/components/entertainment/EntertainmentSection";
import Footer from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { ResidentialPlans } from "@/components/plans/ResidentialPlans";
import { SemiDedicatedPlans } from "@/components/plans/SemiDedicatedPlans";
import { DedicatedPlans } from "@/components/plans/DedicatedPlans";
import { OnepageCheckout } from "@/components/checkout/OnepageCheckout";
import { PlanData } from "@/components/viability/check/useViabilityStepper";

const Plans = () => {
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null);

  const handlePlanSelect = (plan: PlanData) => {
    setSelectedPlan(plan);
  };

  const closeCheckout = () => {
    setSelectedPlan(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-12">
        {/* Checkout overlay when plan selected */}
        {selectedPlan && (
          <OnepageCheckout 
            plan={selectedPlan} 
            onClose={closeCheckout} 
          />
        )}
        
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-bold mb-4">Escolha o Plano Ideal</h1>
            <p className="text-xl text-gray-600">
              Selecione a opção que melhor atende às suas necessidades
            </p>
          </div>
        </Container>
        <EntertainmentSection />
        
        <section className="py-16 bg-[#efeef6]" id="residential-plans">
          <Container>
            <ResidentialPlans onPlanSelect={handlePlanSelect} />
          </Container>
        </section>
        
        <section className="py-16 bg-white">
          <Container>
            <SemiDedicatedPlans onPlanSelect={handlePlanSelect} />
          </Container>
        </section>
        
        <section className="py-16 bg-[#efeef6]">
          <Container>
            <DedicatedPlans onPlanSelect={handlePlanSelect} />
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Plans;
