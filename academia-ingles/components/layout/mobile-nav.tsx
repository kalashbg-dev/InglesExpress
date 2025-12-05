'use client';

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Logo } from "./logo";
import { handleSmoothScroll } from "@/lib/scroll";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const links = [
    { href: "/", label: "Inicio" },
    { href: "#methodology", label: "Metodología" },
    { href: "#niveles", label: "Niveles" },
    { href: "#pricing", label: "Precios" },
    { href: "#contact", label: "Contacto" },
  ];

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menú"
        aria-expanded={isOpen}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
          <div className="fixed inset-y-0 right-0 z-50 h-full w-full max-w-sm bg-background p-6 shadow-xl animate-in slide-in-from-right sm:max-w-sm border-l">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <Logo />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  aria-label="Cerrar menú"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <nav className="flex-1 overflow-y-auto">
                <ul className="flex flex-col space-y-4">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block py-2 text-lg font-medium text-foreground hover:text-primary transition-colors border-b border-border/50"
                        onClick={(e) => {
                          setIsOpen(false);
                          if (link.href.startsWith('#')) {
                            handleSmoothScroll(e, link.href);
                          }
                        }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-8 space-y-4">
                <Button className="w-full" size="lg">
                  Test de Nivel
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  Contactar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
