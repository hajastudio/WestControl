
import React from "react";
import { UserRegistrationDialog } from "./UserRegistrationDialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface User {
  user_id: string;
  role: string;
  created_at: string;
}

interface UsersManagementProps {
  users: User[];
}

export function UsersManagement({ users }: UsersManagementProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gestão de Usuários</h2>
        <UserRegistrationDialog />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Data de Criação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell className="font-medium">{user.user_id.substring(0, 8)}...</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role === 'admin' ? 'Administrador' : 'Atendente'}
                </span>
              </TableCell>
              <TableCell>{new Date(user.created_at).toLocaleDateString('pt-BR')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
