
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function AutomationHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Automações</CardTitle>
        <CardDescription>
          Últimas automações processadas pelo sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border p-4 text-center text-muted-foreground">
          Nenhum registro de automação encontrado.
        </div>
      </CardContent>
    </Card>
  );
}
