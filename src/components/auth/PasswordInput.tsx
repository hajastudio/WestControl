
import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function PasswordInput({ value, onChange, required = true }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      <Input
        id="password"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        className="pl-10 pr-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
      <button
        type="button"
        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}
