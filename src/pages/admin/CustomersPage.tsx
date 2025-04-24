import React from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CustomersList } from "@/components/admin/CustomersList";

export function CustomersPage() {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gerenciamento de Clientes</h1>
        <CustomersList />
      </div>
    </AdminLayout>
  );
} 