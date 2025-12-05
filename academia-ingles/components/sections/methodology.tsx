import { MessageCircle, Users, Monitor, CheckCircle } from "lucide-react";
import { FeatureCard } from "./feature-card";
import { DirectorCard } from "./director-card";

const features = [
  {
    icon: MessageCircle,
    title: "Enfoque Comunicativo",
    description: "Hablarás desde el primer día. Nuestro objetivo es que te comuniques con confianza en situaciones reales.",
  },
  {
    icon: Users,
    title: "Aprendizaje Personalizado",
    description: "Grupos reducidos y seguimiento individual para asegurar que avanzas a tu propio ritmo.",
  },
  {
    icon: Monitor,
    title: "Tecnología Inmersiva",
    description: "Plataforma digital complementaria con ejercicios interactivos y recursos multimedia 24/7.",
  },
  {
    icon: CheckCircle,
    title: "Resultados Garantizados",
    description: "Si asistes al 90% de las clases y no apruebas, repites el nivel completamente GRATIS.",
  },
];

export function Methodology() {
  return (
    <section id="methodology" className="py-20 bg-gray-50 overflow-hidden" aria-labelledby="methodology-title">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* Left Column (Content) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h2 id="methodology-title" className="text-4xl font-bold text-gray-900">
                NUESTRA ESENCIA
              </h2>
              <p className="text-xl text-gray-600 font-medium leading-relaxed max-w-2xl">
                No somos una escuela tradicional. Somos tu aceleradora de idiomas diseñada para resultados rápidos.
              </p>
            </div>

            <div role="list" className="grid sm:grid-cols-2 gap-4 pt-4">
              {features.map((feature, index) => (
                <div key={index} role="listitem">
                  <FeatureCard {...feature} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (Visual) */}
          <div className="lg:col-span-5 relative mt-12 lg:mt-0">
            {/* Background blob decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl -z-10" />

            <DirectorCard />
          </div>

        </div>
      </div>
    </section>
  );
}
