
import React, { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { PlanSelector } from "@/components/plans/PlanSelector";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { OnepageCheckout } from "@/components/checkout/OnepageCheckout";
import { PlanData } from "@/components/viability/check/useViabilityStepper";

const Index = () => {
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null);
  
  // Refs for scroll navigation
  const plansRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  
  // Function to scroll to sections
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Function to handle plan selection
  const handlePlanSelect = (plan: PlanData) => {
    setSelectedPlan(plan);
    // Scroll to checkout
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Function to close checkout
  const closeCheckout = () => {
    setSelectedPlan(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        onScrollToPlans={() => scrollToSection(plansRef)}
        onScrollToBenefits={() => scrollToSection(benefitsRef)}
        onScrollToContact={() => scrollToSection(contactRef)}
      />
      
      <main className="flex-grow">
        {/* Checkout overlay when plan selected */}
        {selectedPlan && (
          <OnepageCheckout 
            plan={selectedPlan} 
            onClose={closeCheckout} 
          />
        )}
        
        {/* Hero Section */}
        <Hero onScrollToPlans={() => scrollToSection(plansRef)} />
        
        {/* Plans Section */}
        <div ref={plansRef} className="scroll-mt-20">
          <PlanSelector onPlanSelect={handlePlanSelect} />
        </div>
        
        {/* Benefits Section */}
        <div ref={benefitsRef} className="scroll-mt-20">
          <BenefitsSection />
        </div>
        
        {/* Contact Section */}
        <div ref={contactRef} className="scroll-mt-20">
          <ContactSection />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
