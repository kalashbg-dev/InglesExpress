'use client';

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300 border-b border-transparent",
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm border-gray-100 h-16"
          : "bg-white h-20"
      )}
    >
      <div className="container h-full flex items-center justify-between">
        <Logo />

        <div className="flex items-center gap-4">
          <MainNav />

          <div className="hidden md:flex items-center gap-2 border-l pl-4 ml-4">
            <Button variant="ghost" size="sm" className="gap-2 px-2" aria-label="Cambiar idioma">
              <Globe className="h-4 w-4" />
              <span className="font-medium">ES</span>
            </Button>

            <Button variant="default" size="sm" className="hidden lg:flex">
              Test de Nivel
            </Button>
          </div>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
