'use client';

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQSearch } from "./faq-search";
import { useFAQs } from "@/hooks/useFAQs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

// Fallback data for demo purposes
const fallbackFaqs = [
  {
    id: 1,
    question: "¿Cuánto tiempo toma aprender inglés?",
    answer: "Con nuestra metodología intensiva, puedes avanzar un nivel completo cada 4 meses. Para llegar a una fluidez conversacional (B2), el promedio es de 16 meses comenzando desde cero.",
    category: 'academic'
  },
  {
    id: 2,
    question: "¿Qué metodología utilizan?",
    answer: "Utilizamos un enfoque comunicativo inmersivo. Desde la primera clase hablarás inglés. Combinamos clases en vivo con profesores nativos y una plataforma digital de refuerzo.",
    category: 'academic'
  },
  {
    id: 3,
    question: "¿Tienen clases los fines de semana?",
    answer: "Sí, tenemos horarios sabatinos intensivos de 9:00 AM a 1:00 PM, perfectos para quienes trabajan o estudian durante la semana.",
    category: 'administrative'
  },
  {
    id: 4,
    question: "¿Cuáles son los métodos de pago?",
    answer: "Aceptamos tarjetas de crédito/débito (Visa, Mastercard), transferencias bancarias y pagos en efectivo en nuestras oficinas. También ofrecemos planes de financiamiento.",
    category: 'administrative'
  },
  {
    id: 5,
    question: "¿Otorgan certificado al finalizar?",
    answer: "Sí, al completar cada nivel recibes un certificado digital. Al finalizar el programa completo, recibes un diploma con validez curricular alineado al Marco Común Europeo (CEFR).",
    category: 'academic'
  },
  {
    id: 6,
    question: "¿Puedo cambiar de horario?",
    answer: "Sí, puedes solicitar cambio de horario al inicio de cada mes, sujeto a disponibilidad del grupo al que desees integrarte.",
    category: 'administrative'
  }
];

export function FAQs() {
  const [filter, setFilter] = useState<'all' | 'academic' | 'administrative'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: faqs, isLoading, error, refetch } = useFAQs();

  // Use API data or fallback
  const displayFaqs = (faqs && faqs.length > 0) ? faqs.map(faq => ({
    id: faq.id,
    question: faq.title,
    answer: faq.content.replace(/<[^>]*>?/gm, ''), // Simple strip HTML tags for now as content usually comes as HTML from WP
    category: faq.infoFAQ?.categoria || 'academic'
  })) : fallbackFaqs;

  const filteredFaqs = displayFaqs.filter(faq => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const matchesCategory = filter === 'all' || (faq as any).category === filter;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="faqs" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            PREGUNTAS FRECUENTES
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Resolvemos tus dudas principales para que inicies con total confianza
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <FAQSearch
            onSearch={setSearchQuery}
            onFilter={setFilter}
          />

          {error && (
             <div className="mb-6">
               <Alert variant="destructive">
                 <AlertDescription className="flex items-center justify-between">
                   <span>No se pudo conectar con el servidor. Mostrando preguntas frecuentes de ejemplo.</span>
                   <Button variant="outline" size="sm" onClick={() => refetch()} className="ml-4 bg-white text-destructive border-destructive hover:bg-red-50">
                     Reintentar
                   </Button>
                 </AlertDescription>
               </Alert>
             </div>
          )}

          {isLoading ? (
             <div className="space-y-4">
               {Array(4).fill(0).map((_, i) => (
                 <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
               ))}
             </div>
          ) : filteredFaqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No se encontraron resultados para tu búsqueda.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
