
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function EmailInput({ value, onChange, required = true }: EmailInputProps) {
  return (
    <div className="relative">
      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      <Input
        id="email"
        type="email"
        placeholder="seu.email@exemplo.com"
        className="pl-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}
