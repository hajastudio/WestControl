
import React from "react";
import { NotificationBanner } from "@/components/ui/notification-banner";
import type { NotificationState } from "./useViabilityStepper";

interface NotificationHandlerProps {
  notification: NotificationState;
  onClose: () => void;
}

export const NotificationHandler: React.FC<NotificationHandlerProps> = ({
  notification,
  onClose,
}) => {
  if (!notification.show) return null;
  return (
    <NotificationBanner
      type={notification.type}
      title={notification.title}
      description={notification.description}
      onClose={onClose}
    />
  );
};
