import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function Footer() {
  return (
    <footer className="bg-gray-50 pt-20 pb-10 border-t border-gray-100">
      <div className="container mx-auto px-4">

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Logo />
            <p className="text-gray-600 leading-relaxed">
              Aprende inglés rápido y efectivo con nuestra metodología garantizada y profesores expertos. Tu futuro comienza aquí.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-lg">Enlaces Rápidos</h4>
            <ul className="space-y-4">
              {[
                { label: "Inicio", href: "/" },
                { label: "Nuestra Metodología", href: "#methodology" },
                { label: "Niveles y Precios", href: "#niveles" },
                { label: "Test de Nivel", href: "#test" },
                { label: "Portal del Estudiante", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-600 hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-lg">Contáctanos</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-gray-600">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Calle Principal #123,<br />Santo Domingo, RD</span>
              </li>
              <li className="flex gap-3 text-gray-600">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="tel:+18095551234" className="hover:text-primary">+1 (809) 555-1234</a>
              </li>
              <li className="flex gap-3 text-gray-600">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="mailto:info@academiaingles.com" className="hover:text-primary">info@academiaingles.com</a>
              </li>
              <li className="flex gap-3 text-gray-600">
                <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Lun - Vie: 8am - 8pm<br />Sáb: 9am - 2pm</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-lg">Mantente Actualizado</h4>
            <p className="text-gray-600 mb-4 text-sm">
              Recibe tips de inglés y ofertas exclusivas en tu correo.
            </p>
            <form className="space-y-3">
              <Input placeholder="Tu correo electrónico" type="email" className="bg-white" />
              <Button className="w-full">Suscribirme</Button>
              <div className="flex items-start gap-2">
                <Checkbox id="terms" className="mt-1" />
                <Label htmlFor="terms" className="text-xs text-gray-500 font-normal leading-tight cursor-pointer">
                  Acepto la política de privacidad y recibir comunicaciones comerciales.
                </Label>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 text-center md:text-left">
            © 2024 Academia de Inglés. Todos los derechos reservados.
          </p>

          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="#" className="hover:text-primary">Términos y Condiciones</Link>
            <Link href="#" className="hover:text-primary">Privacidad</Link>
            <Link href="#" className="hover:text-primary">Cookies</Link>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-md">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Sitio Seguro SSL
          </div>
        </div>
      </div>
    </footer>
  );
}
