import { cn } from "@/lib/utils";

export function SkipLink() {
  return (
    <a
      href="#main"
      className={cn(
        "absolute left-4 top-4 z-[100] -translate-y-[150%] rounded-md bg-primary px-4 py-2 text-primary-foreground transition-transform focus:translate-y-0"
      )}
    >
      Saltar al contenido principal
    </a>
  );
}
