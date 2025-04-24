
import React from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function PlanSelection() {
  return (
    <div className="py-16 bg-white">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Escolha o Plano Ideal para Você</h2>
          <p className="text-gray-600 text-lg">
            Temos a solução perfeita para sua casa ou empresa, com planos flexíveis e atendimento personalizado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Para Você */}
          <div className="relative bg-white border border-brand-gray/30 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer group">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-yellow text-black px-4 py-1 rounded-full font-medium text-sm">
              Mais Popular
            </div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-blue" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                  <path d="M12.0002 14.5C6.99016 14.5 2.91016 17.86 2.91016 22C2.91016 22.28 3.13016 22.5 3.41016 22.5H20.5902C20.8702 22.5 21.0902 22.28 21.0902 22C21.0902 17.86 17.0102 14.5 12.0002 14.5Z" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Para Você</h3>
              <p className="text-gray-600">Internet residencial de alta velocidade</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Velocidade</span>
                <span className="font-medium">Até 1 GIGA</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Download/Upload</span>
                <span className="font-medium">Simétrico</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Paramount+</span>
                <span className="font-medium">Incluso</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Wi-Fi</span>
                <span className="font-medium">Wi-Fi 6</span>
              </div>
            </div>
            
            <Link to="/lead/residential" className="w-full">
              <Button className="w-full bg-brand-blue hover:bg-brand-blue/90 group-hover:bg-brand-red group-hover:hover:bg-brand-red/90 transition-colors">
                Escolher Este Plano
              </Button>
            </Link>
          </div>
          
          {/* Para Seu Negócio */}
          <div className="relative bg-white border border-brand-gray/30 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer group">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-red" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 7.5V6.5C21 5.4 20.1 4.5 19 4.5H5C3.9 4.5 3 5.4 3 6.5V7.5C3 7.6 3.1 7.7 3.2 7.7C4.3 8.2 5 9.3 5 10.5V17.5C5 19.4 6.6 21 8.5 21H18.5C19.4 21 20 20.4 20 19.5C20 18.6 19.4 18 18.5 18H9C8.4 18 8 17.6 8 17C8 16.4 8.4 16 9 16H19C20.1 16 21 15.1 21 14V10.5C21 9.3 21.7 8.2 22.8 7.7C22.9 7.7 23 7.6 23 7.5C23 7.2 22.8 7 22.5 7H3.5C3.2 7 3 7.2 3 7.5C3 7.8 3.2 8 3.5 8H22.5C22.8 8 23 7.8 23 7.5C23 7.6 23 7.6 23 7.5C23 7.6 23 7.6 23 7.5C22.9 7.7 22.8 7.7 22.8 7.7C21.7 8.2 21 9.3 21 10.5V14C21 15.1 20.1 16 19 16H9C8.4 16 8 16.4 8 17C8 17.6 8.4 18 9 18H18.5C19.4 18 20 18.6 20 19.5C20 20.4 19.4 21 18.5 21H8.5C6.6 21 5 19.4 5 17.5V10.5C5 9.3 4.3 8.2 3.2 7.7C3.1 7.7 3 7.6 3 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Para Seu Negócio</h3>
              <p className="text-gray-600">Soluções empresariais dedicadas</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Opções</span>
                <span className="font-medium">Semi ou Dedicado</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Download/Upload</span>
                <span className="font-medium">Simétrico</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Suporte</span>
                <span className="font-medium">Prioritário 24/7</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">IP</span>
                <span className="font-medium">Fixo Disponível</span>
              </div>
            </div>
            
            <Link to="/lead/business" className="w-full">
              <Button className="w-full bg-brand-red hover:bg-brand-red/90 group-hover:bg-brand-blue group-hover:hover:bg-brand-blue/90 transition-colors">
                Escolher Este Plano
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default PlanSelection;
