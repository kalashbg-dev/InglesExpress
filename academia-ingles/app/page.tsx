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
