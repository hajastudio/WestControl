import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { LeadProvider } from "@/context/LeadContext";
import Index from './pages/Index';
import Plans from './pages/Plans';
import Admin from './pages/Admin';
import Attendant from './pages/Attendant';
import NotFound from './pages/NotFound';
import Lead from './pages/Lead';
import Viability from './pages/Viability';
import CheckViability from './pages/CheckViability';
import Waitlist from './pages/Waitlist';
import Login from './pages/Login';
import CompletionForm from './pages/CompletionForm';
import ResetPassword from './pages/ResetPassword';
import SuccessPage from './pages/Success';
import ClientPortal from './pages/ClientPortal';
import { CustomersPage } from "@/pages/admin/CustomersPage";
import LeadsPage from "@/pages/admin/Leads";

export function App() {
  return (
    <LeadProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/lead" element={<Lead />} />
        <Route path="/check" element={<CheckViability />} />
        <Route path="/viability" element={<Viability />} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/form" element={<CompletionForm />} />
        <Route path="/cadastro" element={<CompletionForm />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/leads" element={<LeadsPage />} />
        <Route path="/admin/customers" element={<CustomersPage />} />
        <Route path="/attendant" element={<Attendant />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/client" element={<ClientPortal />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </LeadProvider>
  );
}

export default App;
