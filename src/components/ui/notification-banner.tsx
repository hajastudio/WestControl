
import React, { useEffect } from 'react';
import { X, Check, AlertTriangle, Info } from 'lucide-react';
import { cn } from "@/lib/utils";

interface NotificationBannerProps {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  onClose: () => void;
}

export function NotificationBanner({
  type,
  title,
  description,
  onClose
}: NotificationBannerProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div
        className={cn(
          "flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg",
          "backdrop-blur-lg bg-black/25 border",
          type === 'error' 
            ? "border-[#db451c] shadow-[#db451c]/20" 
            : type === 'warning'
            ? "border-[#f5a623] shadow-[#f5a623]/20"
            : type === 'info'
            ? "border-[#4a90e2] shadow-[#4a90e2]/20"
            : "border-[#2b24a3] shadow-[#2b24a3]/20"
        )}
      >
        <div className="flex items-center gap-3 text-white">
          {type === 'error' ? (
            <AlertTriangle className="h-5 w-5 text-[#db451c]" />
          ) : type === 'warning' ? (
            <AlertTriangle className="h-5 w-5 text-[#f5a623]" />
          ) : type === 'info' ? (
            <Info className="h-5 w-5 text-[#4a90e2]" />
          ) : (
            <Check className="h-5 w-5 text-[#2b24a3]" />
          )}
          <div>
            <h4 className="font-medium leading-none tracking-tight">{title}</h4>
            {description && (
              <p className="text-sm text-white/80 mt-1">{description}</p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-white/60 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
