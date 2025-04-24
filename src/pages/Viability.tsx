
import React from "react";
import Navbar from "@/components/Navbar";
import ViabilityCheck from "@/components/ViabilityCheck";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

const Viability = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <ViabilityCheck />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Viability;
