'use client';

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQSearch } from "./faq-search";
import { useFAQs } from "@/hooks/useFAQs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function FAQs() {
  const [filter, setFilter] = useState<'all' | 'academic' | 'administrative'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: faqs, isLoading, error, refetch } = useFAQs();

  const displayFaqs = faqs ? faqs.map(faq => ({
    id: faq.id,
    question: faq.title,
    answer: faq.content.replace(/<[^>]*>?/gm, ''), // Simple strip HTML tags
    category: faq.infoFAQ?.categoria || 'academic'
  })) : [];

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
                   <span>No se pudo conectar con el servidor.</span>
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
              {error ? 'Intenta recargar la página.' : 'No se encontraron resultados para tu búsqueda.'}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
