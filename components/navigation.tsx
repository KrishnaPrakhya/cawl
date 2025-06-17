"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, PlusCircle, BarChart3, Home, Database } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/quizzes", label: "Quizzes", icon: BookOpen },
    { href: "/create", label: "Create", icon: PlusCircle },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold text-gray-900">Quiz Master</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              MongoDB
            </span>
          </Link>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`flex items-center gap-2 ${
                      isActive
                        ? "bg-green-600 hover:bg-green-700"
                        : "hover:bg-green-50 hover:text-green-600"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
