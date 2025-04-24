import React, { createContext, useContext, useState, ReactNode } from "react";

export interface CombinedData {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  cep: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  reference?: string;
  cpf?: string;
  birthDate?: string;
  status: string;
  created_at: string;
  updated_at: string;
  plantype?: string;
  businesstype?: string;
}

interface LeadContextType {
  leadData: CombinedData;
  setLeadData: (data: CombinedData) => void;
}

const defaultLeadData: CombinedData = {
  id: "",
  name: "",
  email: "",
  whatsapp: "",
  cep: "",
  status: "",
  created_at: "",
  updated_at: ""
};

const LeadContext = createContext<LeadContextType>({
  leadData: defaultLeadData,
  setLeadData: () => {},
});

export const useLeadContext = () => useContext(LeadContext);

interface LeadProviderProps {
  children: ReactNode;
}

export const LeadProvider: React.FC<LeadProviderProps> = ({ children }) => {
  const [leadData, setLeadData] = useState<CombinedData>(defaultLeadData);

  return (
    <LeadContext.Provider value={{ leadData, setLeadData }}>
      {children}
    </LeadContext.Provider>
  );
};
