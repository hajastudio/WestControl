
import React from "react";
import { useParams, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";

const Lead = () => {
  const { type } = useParams<{ type: string }>();
  
  // Validate plan type
  if (type !== "residential" && type !== "business") {
    return <Navigate to="/plans" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <LeadForm planType={type as "residential" | "business"} />
      </main>
      <Footer />
    </div>
  );
};

export default Lead;
