
import React, { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  onScrollToPlans?: () => void;
  onScrollToBenefits?: () => void;
  onScrollToContact?: () => void;
}

export function Navbar({ onScrollToPlans, onScrollToBenefits, onScrollToContact }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Update header background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`py-4 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between">
          <Logo />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              {onScrollToPlans && (
                <button 
                  onClick={onScrollToPlans}
                  className="text-gray-700 hover:text-brand-blue transition-colors font-medium"
                >
                  Planos
                </button>
              )}
              {onScrollToBenefits && (
                <button 
                  onClick={onScrollToBenefits}
                  className="text-gray-700 hover:text-brand-blue transition-colors font-medium"
                >
                  Benefícios
                </button>
              )}
              {onScrollToContact && (
                <button 
                  onClick={onScrollToContact}
                  className="text-gray-700 hover:text-brand-blue transition-colors font-medium"
                >
                  Contato
                </button>
              )}
              {!onScrollToPlans && (
                <Link to="/" className="text-gray-700 hover:text-brand-blue transition-colors font-medium">
                  Início
                </Link>
              )}
              {!onScrollToPlans && (
                <Link to="/plans" className="text-gray-700 hover:text-brand-blue transition-colors font-medium">
                  Planos
                </Link>
              )}
            </nav>
            
            <Link to="/login">
              <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue/10">
                Entrar no Painel
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md py-4 px-6 flex flex-col gap-4 animate-fade-in">
            {onScrollToPlans && (
              <button 
                onClick={() => {
                  onScrollToPlans();
                  setMobileMenuOpen(false);
                }}
                className="text-gray-700 hover:text-brand-blue py-2 transition-colors font-medium"
              >
                Planos
              </button>
            )}
            {onScrollToBenefits && (
              <button 
                onClick={() => {
                  onScrollToBenefits();
                  setMobileMenuOpen(false);
                }}
                className="text-gray-700 hover:text-brand-blue py-2 transition-colors font-medium"
              >
                Benefícios
              </button>
            )}
            {onScrollToContact && (
              <button 
                onClick={() => {
                  onScrollToContact();
                  setMobileMenuOpen(false);
                }}
                className="text-gray-700 hover:text-brand-blue py-2 transition-colors font-medium"
              >
                Contato
              </button>
            )}
            {!onScrollToPlans && (
              <Link to="/" className="text-gray-700 hover:text-brand-blue py-2 transition-colors font-medium">
                Início
              </Link>
            )}
            {!onScrollToPlans && (
              <Link to="/plans" className="text-gray-700 hover:text-brand-blue py-2 transition-colors font-medium">
                Planos
              </Link>
            )}
            <Link to="/login" className="mt-2">
              <Button className="w-full bg-brand-blue hover:bg-brand-blue/90">
                Entrar no Painel
              </Button>
            </Link>
          </div>
        )}
      </Container>
    </header>
  );
}

export default Navbar;
