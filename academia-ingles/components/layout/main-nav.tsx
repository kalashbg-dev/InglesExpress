'use client';

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { ChevronDown } from "lucide-react";

export function MainNav() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Inicio" },
    { href: "#methodology", label: "Metodología" },
    {
      href: "#niveles",
      label: "Niveles",
      children: [
        { href: "#niveles", label: "Todos los niveles" },
        { href: "#niveles", label: "Principiante (A1-A2)" },
        { href: "#niveles", label: "Intermedio (B1-B2)" },
        { href: "#niveles", label: "Avanzado (C1-C2)" },
      ]
    },
    { href: "#pricing", label: "Precios" },
    { href: "#contact", label: "Contacto" },
  ];

  return (
    <nav className="hidden md:flex items-center gap-6" aria-label="Navegación principal">
      <ul className="flex items-center gap-6">
        {links.map((link) => (
          <li key={link.href} className="relative group">
            <Link
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1",
                pathname === link.href ? "text-primary" : "text-gray-600"
              )}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
              {link.children && <ChevronDown className="h-4 w-4" />}
            </Link>

            {/* Simple Dropdown for demo purposes */}
            {link.children && (
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <ul className="bg-white rounded-md shadow-lg border p-2 min-w-[200px]">
                  {link.children.map((child, index) => (
                    <li key={index}>
                      <Link
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary rounded-md"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
