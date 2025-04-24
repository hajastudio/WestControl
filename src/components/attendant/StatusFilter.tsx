
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface StatusFilterProps {
  selectedStatuses: string[];
  onStatusChange: (statuses: string[]) => void;
}

const statusOptions = [
  { id: "viable", label: "Viável", color: "bg-green-100 text-green-800" },
  { id: "waiting_docs", label: "Aguardando documentos", color: "bg-yellow-100 text-yellow-800" },
  { id: "analyzing", label: "Em análise", color: "bg-blue-100 text-blue-800" },
  { id: "approved", label: "Aprovado", color: "bg-green-100 text-green-800" },
  { id: "rejected", label: "Recusado", color: "bg-red-100 text-red-800" },
  { id: "waitlist", label: "Lista de espera", color: "bg-purple-100 text-purple-800" },
];

export default function StatusFilter({ selectedStatuses, onStatusChange }: StatusFilterProps) {
  const handleStatusToggle = (statusId: string) => {
    if (selectedStatuses.includes(statusId)) {
      onStatusChange(selectedStatuses.filter(id => id !== statusId));
    } else {
      onStatusChange([...selectedStatuses, statusId]);
    }
  };

  return (
    <div className="space-y-3">
      {statusOptions.map((status) => (
        <div key={status.id} className="flex items-center space-x-2">
          <Checkbox
            id={`status-${status.id}`}
            checked={selectedStatuses.includes(status.id)}
            onCheckedChange={() => handleStatusToggle(status.id)}
          />
          <label
            htmlFor={`status-${status.id}`}
            className="text-sm font-medium cursor-pointer flex items-center"
          >
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusColor(status.id)}`}></span>
            {status.label}
          </label>
        </div>
      ))}
    </div>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case "approved":
      return "bg-green-500";
    case "rejected":
      return "bg-red-500";
    case "analyzing":
      return "bg-yellow-500";
    case "waitlist":
      return "bg-purple-500";
    case "viable":
      return "bg-green-300";
    case "waiting_docs":
      return "bg-yellow-300";
    default:
      return "bg-gray-500";
  }
}
