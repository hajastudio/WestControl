
import React from "react";
import Navbar from "@/components/Navbar";
import WaitList from "@/components/WaitList";
import Footer from "@/components/Footer";

const WaitlistPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <WaitList />
      </main>
      <Footer />
    </div>
  );
};

export default WaitlistPage;
