
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  message: string;
  created_at: string;
}

interface NotificationsListProps {
  notifications: Notification[];
}

export const NotificationsList = ({ notifications }: NotificationsListProps) => {
  if (notifications.length === 0) {
    return (
      <p className="text-center text-gray-500">
        Nenhuma notificação encontrada.
      </p>
    );
  }

  return (
    <div>
      <h2 className="font-bold mb-4">Histórico de Notificações</h2>
      {notifications.map((notification) => (
        <div 
          key={notification.id} 
          className="bg-white/50 p-3 rounded-lg mb-2"
        >
          <p>{notification.message}</p>
          <small className="text-gray-500">
            {new Date(notification.created_at).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
};
