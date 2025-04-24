
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap } from 'lucide-react';
import type { PlanData } from "@/components/viability/check/useViabilityStepper";

interface UpgradeOfferProps {
  currentPlan: PlanData;
  onUpgrade: () => void;
  onSkip: () => void;
  isLoading?: boolean;
}

export function UpgradeOffer({ currentPlan, onUpgrade, onSkip, isLoading }: UpgradeOfferProps) {
  const upgradedSpeed = parseInt(currentPlan.speed) + 200;
  const originalPrice = parseFloat(currentPlan.price.replace('R$ ', '').replace(',', '.'));
  const discountedPrice = (originalPrice + 20).toFixed(2);

  return (
    <div className="space-y-6 py-4">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Zap className="w-6 h-6 text-yellow-500" />
          <h3 className="text-xl font-bold">Oferta Especial!</h3>
        </div>
        <p className="text-gray-600">
          Upgrade seu plano agora e ganhe mais velocidade com um desconto especial!
        </p>
      </div>

      <div className="bg-blue-50 p-6 rounded-xl space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold">{currentPlan.name} PLUS</h4>
            <p className="text-sm text-gray-600">{upgradedSpeed} MEGA</p>
          </div>
          <Badge variant="secondary" className="bg-blue-200">
            Economia de 50%
          </Badge>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            R$ {discountedPrice}
            <span className="text-sm text-gray-500">/mês</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          onClick={onUpgrade}
          className="w-full bg-brand-blue hover:bg-brand-blue/90"
          disabled={isLoading}
        >
          Aproveitar Oferta
        </Button>
        <Button
          variant="outline"
          onClick={onSkip}
          className="w-full"
          disabled={isLoading}
        >
          Manter Plano Atual
        </Button>
      </div>
    </div>
  );
}
