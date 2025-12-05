import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)} aria-label="Academia de Inglés - Inicio">
      <div className="flex flex-col leading-none">
        <span className="text-xl font-bold text-gray-900 tracking-tight">ACADEMIA</span>
        <span className="text-xl font-extrabold text-primary tracking-wide">INGLÉS</span>
      </div>
    </Link>
  );
}
