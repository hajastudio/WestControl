
import React from "react";
import Navbar from "@/components/Navbar";
import ViabilityChecker from "@/components/ViabilityChecker";
import Footer from "@/components/Footer";
import { useLocation } from "react-router-dom";

const CheckViability = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedPlan = searchParams.get("plano") || "";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <ViabilityChecker selectedPlan={selectedPlan} />
      </main>
      <Footer />
    </div>
  );
};

export default CheckViability;
