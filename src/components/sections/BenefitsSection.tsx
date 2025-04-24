
import React from "react";
import { Container } from "@/components/ui/container";
import { Check, Zap, Clock, Wifi, Package } from "lucide-react";

export function BenefitsSection() {
  return (
    <section className="py-20 bg-brand-gray/30">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefícios Exclusivos</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Oferecemos muito mais do que apenas internet. Confira os benefícios inclusos em todos os nossos planos.
          </p>
        </div>

        {/* Streaming Logos */}
        <div className="mb-16">
          <h3 className="text-xl font-semibold mb-6 text-center">Streaming e Entretenimento Inclusos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-items-center">
            <div className="bg-white p-6 rounded-xl shadow-md w-40 h-24 flex items-center justify-center">
              <div className="font-bold text-xl text-blue-700">Paramount+</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md w-40 h-24 flex items-center justify-center">
              <div className="font-bold text-xl text-red-600">Telecine</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md w-40 h-24 flex items-center justify-center">
              <div className="font-bold text-xl text-purple-600">WatchTV</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md w-40 h-24 flex items-center justify-center">
              <div className="font-bold text-xl text-blue-400">MTV</div>
            </div>
          </div>
        </div>

        {/* Benefits Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-brand-blue/10 hover:border-brand-blue/30">
            <div className="w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center mb-4">
              <Clock className="text-brand-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instalação em 24h</h3>
            <p className="text-gray-600">
              Equipe técnica especializada para instalação rápida e profissional em até 24 horas após a aprovação.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-brand-blue/10 hover:border-brand-blue/30">
            <div className="w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center mb-4">
              <Zap className="text-brand-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fibra Óptica</h3>
            <p className="text-gray-600">
              Conexão de alta velocidade com fibra óptica de ponta a ponta para uma experiência sem interrupções.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-brand-blue/10 hover:border-brand-blue/30">
            <div className="w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center mb-4">
              <Wifi className="text-brand-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Wi-Fi 6 Incluso</h3>
            <p className="text-gray-600">
              Tecnologia de última geração para maior alcance e mais dispositivos conectados simultaneamente.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-brand-blue/10 hover:border-brand-blue/30">
            <div className="w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center mb-4">
              <Package className="text-brand-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-2">App WestControl</h3>
            <p className="text-gray-600">
              Gerencie sua conta, pague faturas e acesse suporte técnico diretamente do seu smartphone.
            </p>
          </div>
        </div>

        {/* Additional Features List */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            "Suporte técnico 24/7",
            "Sem franquia de dados",
            "IP Fixo opcional",
            "Backup em nuvem",
            "Monitoramento em tempo real",
            "Antivírus incluso"
          ].map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="mt-1 bg-brand-blue/10 p-1 rounded-full">
                <Check className="w-4 h-4 text-brand-blue" />
              </div>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
