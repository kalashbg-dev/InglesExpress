import { Hero } from '@/components/sections/hero';
import { Methodology } from '@/components/sections/methodology';
import { LevelsRoadmap } from '@/components/sections/levels-roadmap';
import { LevelTestCTA } from '@/components/sections/level-test-cta';
import { FAQs } from '@/components/sections/faqs';
import { StatsGrid } from '@/components/sections/stats-grid';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <StatsGrid />

      {/* Methodology Section */}
      <Methodology />

      {/* Levels Roadmap */}
      <LevelsRoadmap />

      {/* Level Test CTA */}
      <LevelTestCTA />

      {/* FAQs Section */}
      <FAQs />

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Nuestros Precios</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
             {/* Plan Básico */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-4">Básico</h3>
              <p className="text-4xl font-bold mb-4">$50<span className="text-sm font-normal text-gray-500">/mes</span></p>
              <ul className="space-y-3 mb-8 text-gray-600">
                <li className="flex items-center gap-2">✓ Acceso a la plataforma</li>
                <li className="flex items-center gap-2">✓ Clases grabadas</li>
                <li className="flex items-center gap-2">✓ Material descargable</li>
              </ul>
              <button className="w-full py-2 px-4 border border-red-600 text-red-600 rounded hover:bg-red-50 font-medium transition-colors">
                Elegir Plan
              </button>
            </div>

            {/* Plan Recomendado */}
            <div className="bg-white p-8 rounded-lg shadow-md border-2 border-red-600 relative transform md:-translate-y-2">
              <div className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded-bl">Popular</div>
              <h3 className="text-xl font-bold mb-4 text-red-600">Pro</h3>
              <p className="text-4xl font-bold mb-4">$90<span className="text-sm font-normal text-gray-500">/mes</span></p>
              <ul className="space-y-3 mb-8 text-gray-600">
                <li className="flex items-center gap-2">✓ Todo lo del plan Básico</li>
                <li className="flex items-center gap-2">✓ Clases en vivo semanales</li>
                <li className="flex items-center gap-2">✓ Tutoría personalizada</li>
                <li className="flex items-center gap-2">✓ Certificado de finalización</li>
              </ul>
              <button className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 font-medium transition-colors">
                Elegir Plan
              </button>
            </div>

            {/* Plan Premium */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-4">Premium</h3>
              <p className="text-4xl font-bold mb-4">$150<span className="text-sm font-normal text-gray-500">/mes</span></p>
              <ul className="space-y-3 mb-8 text-gray-600">
                <li className="flex items-center gap-2">✓ Todo lo del plan Pro</li>
                <li className="flex items-center gap-2">✓ Clases 1:1 ilimitadas</li>
                <li className="flex items-center gap-2">✓ Preparación exámenes</li>
              </ul>
              <button className="w-full py-2 px-4 border border-red-600 text-red-600 rounded hover:bg-red-50 font-medium transition-colors">
                Elegir Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Contáctanos</h2>
          <div className="max-w-2xl mx-auto">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" placeholder="Tu nombre" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" placeholder="tu@email.com" />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                <textarea id="message" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" placeholder="¿Cómo podemos ayudarte?"></textarea>
              </div>
              <div className="text-center">
                <button type="submit" className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
                  Enviar Mensaje
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Confiado por más de 500 estudiantes
          </h3>
          <p className="text-gray-600">
            Únete a nuestra comunidad y comienza tu viaje hacia la fluidez en inglés
          </p>
        </div>
      </section>
    </>
  );
}
