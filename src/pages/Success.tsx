
import React from "react";
import Navbar from "@/components/Navbar";
import SuccessMessage from "@/components/SuccessMessage";
import Footer from "@/components/Footer";

const SuccessPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <SuccessMessage />
      </main>
      <Footer />
    </div>
  );
};

export default SuccessPage;
