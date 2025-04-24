import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Users,
  Settings,
  FileText,
  MapPin,
  Mail,
  Zap,
  User,
  LayoutDashboard
} from "lucide-react";

export function AdminSidebar() {
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin"
    },
    {
      title: "Leads",
      icon: Users,
      href: "/admin/leads"
    },
    {
      title: "Clientes",
      icon: User,
      href: "/admin/customers"
    },
    {
      title: "Cobertura",
      icon: MapPin,
      href: "/admin/coverage"
    },
    {
      title: "Email",
      icon: Mail,
      href: "/admin/email"
    },
    {
      title: "Configurações",
      icon: Settings,
      href: "/admin/settings"
    }
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin</h1>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link key={item.href} to={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                location.pathname === item.href
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  );
}
