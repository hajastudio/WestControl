
import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos em segundos

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center justify-center gap-2 text-yellow-600 bg-yellow-100 p-2 rounded-lg mb-4">
      <Timer className="w-5 h-5" />
      <span className="font-semibold">
        Oferta expira em: {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}
