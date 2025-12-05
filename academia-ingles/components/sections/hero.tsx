import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-10 pb-20 lg:pt-20 lg:pb-28">
      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text Content */}
          <div className="w-full lg:w-1/2 space-y-8 animate-in slide-in-from-left duration-700">
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
              APRENDE INGLÉS <br />
              <span className="relative inline-block text-primary">
                EN 4 MESES
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-yellow-300 -z-10 opacity-70"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 5 Q 50 10 100 5"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
              La única academia que garantiza tu fluidez con una metodología inmersiva y profesores nativos expertos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="h-14 px-8 text-lg gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                Empieza Ahora
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg gap-2">
                <Play className="h-5 w-5 fill-current" />
                Cómo Funciona
              </Button>
            </div>

            <div className="pt-4 flex items-center gap-4 text-sm font-medium text-gray-500">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden relative">
                     {/* Placeholder avatars */}
                     <div className="absolute inset-0 bg-gray-300 flex items-center justify-center text-xs">U{i}</div>
                  </div>
                ))}
              </div>
              <p>500+ estudiantes confían en nosotros</p>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="w-full lg:w-1/2 relative animate-in fade-in zoom-in duration-1000 delay-200">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-blue-500/10 mix-blend-multiply z-10" />

              {/* Placeholder for Hero Image */}
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 font-medium text-lg">Student Image Placeholder</span>
              </div>

              {/* Floating Badge */}
              <div className="absolute top-8 right-8 z-20 bg-white p-4 rounded-xl shadow-xl transform rotate-3 animate-pulse-slow border border-gray-100">
                 <div className="flex items-center gap-2">
                   <div className="h-3 w-3 rounded-full bg-green-500" />
                   <span className="font-bold text-gray-900">METODOLOGÍA GARANTIZADA</span>
                 </div>
              </div>
            </div>

            {/* Decorative pattern */}
            <div className="absolute -z-10 -bottom-12 -left-12 w-64 h-64 opacity-20"
                 style={{ backgroundImage: 'radial-gradient(circle, #E63946 2px, transparent 2.5px)', backgroundSize: '24px 24px' }}
            />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden lg:flex flex-col items-center gap-2 text-gray-400 text-sm">
        <span>Descubre más</span>
        <ArrowRight className="h-4 w-4 rotate-90" />
      </div>
    </section>
  );
}
