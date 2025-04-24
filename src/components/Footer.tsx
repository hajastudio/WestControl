
import React from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Phone, Settings, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Footer() {
  const { isAdmin } = useIsAdmin();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-12 mt-16 relative font-inter">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <img 
              src="https://westtelecom.net/wp-content/uploads/2019/11/logo-westAsset-1.svg" 
              alt="West Telecom" 
              className="h-12" 
            />
            <p className="text-xs text-gray-400">
              WEST COMÉRCIO E SERVIÇOS DE TELECOMUNICAÇÕES LTDA<br />
              CNPJ: 45.652.605/0001-03
            </p>
          </div>

          <div>
            <h3 className="font-bold text-sm mb-3">Contato</h3>
            <div className="space-y-1">
              <p className="text-xs text-gray-400">(21) 2406-6200</p>
              <p className="text-xs text-gray-400">Rua Ibitiúva, 364 - Padre Miguel - RJ</p>
              <p className="text-xs text-gray-400">Seg à Sab: 09:00 - 18:00</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm mb-3">Provedor Licenciado</h3>
            <img 
              src="https://westtelecom.net/wp-content/uploads/2019/11/provedores-west-1.png" 
              alt="Provedor Licenciado" 
              className="max-w-[150px]"
            />
          </div>

          <div>
            <h3 className="font-bold text-sm mb-3">Localização</h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-gray-400" />
                <p className="text-xs text-gray-400">
                  Rua Ibitiúva, 364 - Padre Miguel<br />
                  Rio de Janeiro - RJ, 21740-130
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400 text-center md:text-left">
              © {currentYear} Todos os direitos reservados a West Telecom
            </p>
            <div className="flex gap-4">
              <Link to="/terms" className="text-xs text-gray-400 hover:text-white transition-colors">
                Termos de Uso
              </Link>
              <Link to="/privacy" className="text-xs text-gray-400 hover:text-white transition-colors">
                Política de Privacidade
              </Link>
            </div>
          </div>
        </div>
      </Container>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link 
              to="/login" 
              className="fixed bottom-6 right-6 z-50"
            >
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white/10 backdrop-blur-sm border-gray-700 hover:bg-white/20"
              >
                <Settings className="h-4 w-4 text-white" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Área restrita</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </footer>
  );
}

export default Footer;
