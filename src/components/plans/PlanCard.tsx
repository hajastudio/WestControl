
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Rocket } from "lucide-react";

interface PlanCardProps {
  name: string;
  speed: string;
  price: string;
  benefits: string[];
  description?: string;
  tagline?: string;
  recommended?: boolean;
  businessType?: "semi" | "dedicated";
  planType: string;
  onSelect: () => void;
}

export function PlanCard({ 
  name, 
  speed, 
  price, 
  benefits, 
  description, 
  tagline,
  recommended, 
  businessType,
  planType,
  onSelect
}: PlanCardProps) {
  return (
    <div className={cn(
      "relative p-8 rounded-xl transition-all duration-300",
      "bg-white/90 backdrop-blur-xl border border-white/50",
      "hover:shadow-xl hover:border-[#2b24a3]/50",
      "hover:shadow-[#2b24a3]/10 h-full flex flex-col justify-between",
      recommended && "transform hover:scale-[1.02]"
    )}>
      {recommended && (
        <Badge 
          className="absolute -top-3 right-4 bg-[#f9d61f] text-black font-semibold"
        >
          MAIS ESCOLHIDO
        </Badge>
      )}
      {businessType && (
        <Badge 
          variant="outline" 
          className="absolute -top-3 left-4 bg-[#db451c] text-white border-none font-semibold"
        >
          EMPRESARIAL
        </Badge>
      )}

      <div>
        <h3 className="text-xl font-bold mb-1 text-gray-800">{name}</h3>
        {tagline && (
          <p className="text-sm text-gray-600 italic mb-4">{tagline}</p>
        )}
        
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-6 w-6 text-[#db451c]" />
          <div className="text-3xl font-bold text-[#2b24a3]">{speed}</div>
        </div>
        
        {description && (
          <div className="p-3 bg-[#efeef6] rounded-lg mb-5 text-sm text-gray-700">
            {description}
          </div>
        )}

        <div className="mb-6">
          <p className="font-semibold mb-2 text-gray-700">Benefícios:</p>
          <ul className="space-y-3 text-sm">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-1 text-[#2b24a3] flex-shrink-0" />
                <span className="text-gray-600">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <div className="text-2xl font-bold mb-4 text-gray-800">
          <span className="text-3xl">{price}</span><span className="text-sm text-gray-500">/mês</span>
        </div>

        <Button 
          onClick={onSelect}
          className={cn(
            "w-full text-white flex items-center justify-center gap-2 py-6",
            businessType === "dedicated" 
              ? "bg-[#db451c] hover:bg-[#db451c]/90" 
              : businessType === "semi" 
                ? "bg-[#f9d61f] hover:bg-[#f9d61f]/90 text-black" 
                : "bg-[#2b24a3] hover:bg-[#2b24a3]/90"
          )}
        >
          <span>ASSINAR</span>
          <Rocket className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
