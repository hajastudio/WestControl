import React from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

// Avatares de clientes (placeholders)
const avatarImages = [
  "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=facearea&w=80&h=80&facepad=3",
  "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=facearea&w=80&h=80&facepad=3",
  "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=facearea&w=80&h=80&facepad=3",
  "https://randomuser.me/api/portraits/men/77.jpg"
];

interface HeroProps {
  onScrollToPlans: () => void;
}

export function Hero({ onScrollToPlans }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-brand-blue/10 via-white to-brand-gray/20 pt-32 pb-24 font-inter">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-yellow/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-brand-red/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl"></div>
      </div>
      
      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-brand-blue/10 text-brand-blue font-medium text-sm">
                Ultra Internet + Streaming
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Conectando sua <span className="text-brand-blue">casa</span> e <span className="text-brand-red">empresa</span> ao futuro
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-xl tracking-tight">
                Planos com Paramount+, WatchTV e +10.000 horas de conteúdo exclusivo para toda família
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-6 text-lg shadow-lg"
                onClick={onScrollToPlans}
              >
                Escolher meu plano <ChevronDown className="ml-1" />
              </Button>
            </div>
            
            <div className="flex items-center gap-4 mt-8">
              <div className="flex -space-x-2">
                {avatarImages.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Cliente satisfeito"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-md bg-gray-200"
                  />
                ))}
              </div>
              <div>
                <p className="font-medium">Mais de 10.000 clientes satisfeitos</p>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-5 h-5 text-brand-yellow" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                  <span className="ml-2 text-gray-600">4.9/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Hero;
