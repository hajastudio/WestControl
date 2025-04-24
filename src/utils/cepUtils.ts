
// Function to format CEP input (12345678 -> 12345-678)
export function formatCep(cep: string): string {
  // Remove any non-digit characters
  const digits = cep.replace(/\D/g, "");
  
  // Format as 12345-678
  if (digits.length <= 5) {
    return digits;
  }
  
  return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
}

// Function to validate CEP format
export function validateCep(cep: string): boolean {
  const cepRegex = /^[0-9]{5}-?[0-9]{3}$/;
  return cepRegex.test(cep);
}

// Function to normalize CEP (remove mask) before sending to API
export function normalizeCep(cep: string): string {
  return cep.replace(/\D/g, "");
}

// Function to format phone number (11999999999 -> (11) 99999-9999)
export function formatPhone(phone: string): string {
  // Remove any non-digit characters
  const digits = phone.replace(/\D/g, "");
  
  if (digits.length <= 2) {
    return digits;
  }
  
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

// Function to format CPF (12345678900 -> 123.456.789-00)
export function formatCpf(cpf: string): string {
  // Remove any non-digit characters
  const digits = cpf.replace(/\D/g, "");
  
  if (digits.length <= 3) {
    return digits;
  }
  
  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  }
  
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }
  
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

// Mock function for CEP viability check (in a real app, this would call your API)
export async function checkCepViability(cep: string): Promise<{
  viable: boolean;
  address?: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}> {
  try {
    // Normalize CEP before sending
    const normalizedCep = normalizeCep(cep);
    
    // In a real application, we would check against a database or API
    // For demo purposes, we'll use the ViaCEP API and consider even CEPs as viable
    const response = await fetch(`https://viacep.com.br/ws/${normalizedCep}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      return { viable: false };
    }
    
    // Mock: Even CEP numbers are viable, odd ones are not
    const lastDigit = parseInt(normalizedCep.slice(-1));
    const isViable = lastDigit % 2 === 0;
    
    return {
      viable: isViable,
      address: {
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
      },
    };
  } catch (error) {
    console.error("Error checking CEP viability:", error);
    return { viable: false };
  }
}
