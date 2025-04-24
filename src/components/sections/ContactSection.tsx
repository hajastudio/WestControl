
import React from "react";
import { Container } from "@/components/ui/container";
import { MapPin, Phone, Mail, Wifi, Globe, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ContactSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-brand-gray/10 relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 text-brand-blue font-medium text-sm transition-all hover:bg-brand-blue/20">
              <Wifi className="w-4 h-4" />
              <span>Internet Fibra Óptica</span>
            </div>
            
            {/* Main Title */}
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                A conexão que sua Casa & Empresa{" "}
                <span className="text-brand-blue">merecem</span>
              </h2>
              
              <p className="text-lg text-gray-600">
                Chegou a fibra óptica para levar sua internet a outro nível!
              </p>
            </div>

            {/* Features List */}
            <div className="grid gap-6">
              <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all">
                <CardContent className="p-6">
                  <div className="flex gap-4 items-start">
                    <div className="bg-brand-blue/10 p-3 rounded-xl">
                      <Globe className="w-6 h-6 text-brand-blue" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-gray-900">Velocidade ultrarrápida</h3>
                      <p className="text-gray-600">Streaming sem interrupções e jogos sem delays</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all">
                <CardContent className="p-6">
                  <div className="flex gap-4 items-start">
                    <div className="bg-brand-blue/10 p-3 rounded-xl">
                      <Gauge className="w-6 h-6 text-brand-blue" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-gray-900">Conexão estável</h3>
                      <p className="text-gray-600">Videoconferências e trabalho remoto sem quedas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Contact Info */}
          <div className="lg:pl-8">
            <Card className="border-none shadow-xl bg-white/70 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Entre em contato</h3>
                
                <div className="space-y-8">
                  {/* Phone Numbers */}
                  <div className="flex items-start gap-4">
                    <div className="bg-brand-blue p-3 rounded-xl">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg text-gray-900">Fale conosco</h4>
                      <div className="space-y-3">
                        {[
                          { label: "Central", number: "+552124066200" },
                          { label: "Vendas", number: "+5521985219470" },
                          { label: "Suporte", number: "+5521985219472" }
                        ].map((item) => (
                          <a 
                            key={item.number}
                            href={`tel:${item.number}`} 
                            className="flex items-center gap-2 group"
                          >
                            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                              {item.label}:
                            </span>
                            <span className="text-brand-blue font-medium group-hover:text-brand-blue/80 transition-colors">
                              {item.number.replace(/(\+55)(\d{2})(\d{4,5})(\d{4})/, '$1 ($2) $3-$4')}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="bg-brand-blue p-3 rounded-xl">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-lg text-gray-900">E-mail</h4>
                      <a 
                        href="mailto:contato@westtelecom.net" 
                        className="text-brand-blue hover:text-brand-blue/80 transition-colors"
                      >
                        contato@westtelecom.net
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="bg-brand-blue p-3 rounded-xl">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-lg text-gray-900">Endereço</h4>
                      <address className="not-italic text-gray-600">
                        Rua Ibitiúva, 364 - Padre Miguel<br />
                        Rio de Janeiro - RJ
                      </address>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                  <Button 
                    size="lg" 
                    className="bg-brand-blue hover:bg-brand-blue/90 shadow-lg hover:shadow-xl transition-all duration-300"
                    asChild
                  >
                    <a 
                      href="https://wa.me/5521985219470" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" /> 
                      Falar com consultor
                    </a>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-brand-blue text-brand-blue hover:bg-brand-blue/10 transition-all duration-300"
                    asChild
                  >
                    <a href="#planos">
                      Conhecer planos
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default ContactSection;
