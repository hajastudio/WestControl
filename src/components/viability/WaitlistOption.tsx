
import React from "react";

interface WaitlistOptionProps {
  onJoin: () => void;
  onDecline: () => void;
  isLoading: boolean;
}

export const WaitlistOption: React.FC<WaitlistOptionProps> = ({
  onJoin,
  onDecline,
  isLoading,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h3 className="font-medium text-yellow-800 mb-2">Ainda não chegamos lá...</h3>
        <p className="text-yellow-700">
          Infelizmente ainda não atendemos essa região. Deseja entrar para nossa lista de espera?
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onJoin}
          className="flex-1 bg-[#db451c] hover:bg-[#db451c]/90 text-white py-3 rounded-md font-medium transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Processando..." : "Sim, quero ser avisado"}
        </button>
        
        <button
          onClick={onDecline}
          className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
          disabled={isLoading}
        >
          Não, obrigado
        </button>
      </div>
    </div>
  );
};
