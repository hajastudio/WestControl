import React from "react";
import { LeadsList } from "@/components/admin/LeadsList";
import { Container } from "@/components/ui/container";

export default function LeadsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        <LeadsList />
      </Container>
    </div>
  );
} 