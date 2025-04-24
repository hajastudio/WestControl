
import React from "react";
import Navbar from "@/components/Navbar";
import CompletionForm from "@/components/CompletionForm";
import Footer from "@/components/Footer";

const CompletionFormPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <CompletionForm />
      </main>
      <Footer />
    </div>
  );
};

export default CompletionFormPage;
