import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function LevelTestCTA() {
  return (
    <section className="bg-gray-900 py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">

          <div className="absolute top-6 right-6">
            <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider animate-pulse">
              Gratis
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            <div className="space-y-6 flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                ¿No sabes tu nivel actual?
              </h2>
              <p className="text-gray-300 text-lg">
                Toma nuestro examen gratuito de 15 minutos y descubre exactamente dónde empezar tu viaje.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center md:justify-start text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>95% de precisión</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Resultados inmediatos</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-full md:w-auto">
              <Button size="lg" className="w-full md:w-auto h-14 px-8 text-lg font-semibold bg-white text-gray-900 hover:bg-gray-100 hover:text-primary transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                Iniciar Test
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="mt-4 text-xs text-center text-gray-500">
                Sin compromiso de compra
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
