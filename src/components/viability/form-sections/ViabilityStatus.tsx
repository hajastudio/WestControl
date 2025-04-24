
import React from "react";
import { Info } from "lucide-react";
import { NotificationBanner } from "@/components/ui/notification-banner";

interface ViabilityStatusProps {
  isViable: boolean;
  isLoading: boolean;
  error?: string;
}

export const ViabilityStatus: React.FC<ViabilityStatusProps> = ({
  isViable,
  isLoading,
  error,
}) => {
  const [showNotification, setShowNotification] = React.useState(!!error);

  React.useEffect(() => {
    if (error) {
      setShowNotification(true);
    }
  }, [error]);

  if (isLoading || isViable === null) return null;

  return (
    <>
      {showNotification && error && (
        <NotificationBanner
          type="error"
          title="Ocorreu um erro ao processar sua solicitação"
          description={error}
          onClose={() => setShowNotification(false)}
        />
      )}

      {isViable === false && (
        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-5 w-5 text-yellow-700" />
              <h3 className="text-lg font-semibold text-yellow-700">
                Infelizmente ainda não atendemos sua região
              </h3>
            </div>
            <p className="mb-4">
              Deseja entrar na nossa lista de espera? Entraremos em contato assim que tivermos disponibilidade.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
