import React from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Film, Tv2, MonitorPlay, PlayCircle } from "lucide-react";
import { PartnerCarousel } from "./PartnerCarousel";

export function EntertainmentSection() {
  const scrollToPlans = () => {
    const plansElement = document.getElementById("residential-plans");
    if (plansElement) {
      plansElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#efeef6]" />
      <Container className="relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-brand-blue">
            Internet + Entretenimento Completo para Sua Casa
          </h2>
        </div>

        <div className="glassmorphism-card p-8 md:p-12 max-w-4xl mx-auto mb-12 relative border-neon">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-brand-blue via-brand-red to-brand-yellow bg-clip-text text-transparent">
              + 11.000 horas de conteúdo gratuito
            </h3>
            <p className="text-lg md:text-xl text-gray-700 mb-6">
              Assine qualquer plano residencial e ganhe acesso total à plataforma Watch TV + Paramount+
            </p>
          </div>

          <PartnerCarousel />

          <div className="flex flex-wrap justify-center gap-6 my-8 text-gray-600">
            <div className="flex items-center gap-2">
              <Film className="h-5 w-5 text-brand-blue" />
              <span>🎥 Filmes</span>
            </div>
            <div className="flex items-center gap-2">
              <Tv2 className="h-5 w-5 text-brand-red" />
              <span>📺 Séries</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⚽ Esportes</span>
            </div>
            <div className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-brand-blue" />
              <span>👨‍👩‍👧‍👦 Infantil</span>
            </div>
          </div>

          <p className="text-lg text-center text-gray-700 italic mb-8 max-w-2xl mx-auto">
            "Com a West Telecom, você não contrata só internet. Você assina momentos de diversão, 
            maratonas em família e experiências imersivas sem travar."
          </p>

          <div className="text-center">
            <Button
              onClick={scrollToPlans}
              className="bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-6 text-lg rounded-xl"
            >
              Ver Planos Residenciais
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
