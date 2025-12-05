'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgeCheck, Quote, BookOpen, Clock, Users, Calendar } from "lucide-react";

interface LevelDetailModalProps {
  level: any; // Using any for now, will replace with proper type later
  trigger: React.ReactNode;
}

export function LevelDetailModal({ level, trigger }: LevelDetailModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto sm:h-auto p-0 gap-0">
        <div className="grid md:grid-cols-12 h-full">
          {/* Sidebar Info */}
          <div className="md:col-span-4 bg-gray-50 p-6 border-r border-gray-100 flex flex-col">
            <div className="mb-6">
              <div className="aspect-[3/4] bg-white rounded-lg shadow-md p-2 mb-4 mx-auto max-w-[180px] rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* Book Image Placeholder */}
                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-center p-2">
                   <span className="text-xs text-gray-500">{level.infoNivel.imagenLibro?.altText || 'Libro del Nivel'}</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center">{level.title}</h2>
              <div className="flex justify-center mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white
                  ${level.infoNivel.codigoVisual.startsWith('A') ? 'bg-red-500' :
                    level.infoNivel.codigoVisual.startsWith('B') ? 'bg-blue-500' : 'bg-green-500'}`
                }>
                  Nivel {level.infoNivel.codigoVisual}
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Clock className="h-5 w-5 text-primary" />
                <span>Duración: <strong className="text-gray-900">{level.infoNivel.duracion}</strong></span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Users className="h-5 w-5 text-primary" />
                <span>Clases en vivo</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Inicio flexible</span>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-200">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                RD$ {level.infoNivel.precio.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mb-4">Pago único por nivel completo</p>
              <Button className="w-full" size="lg">Inscribirme Ahora</Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-8 p-6 md:p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl">Detalles del Programa</DialogTitle>
              <DialogDescription>
                Todo lo que aprenderás en este nivel para acercarte a la fluidez.
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="temario" className="w-full">
              <TabsList className="mb-6 w-full justify-start">
                <TabsTrigger value="temario">Temario</TabsTrigger>
                <TabsTrigger value="metodologia">Metodología</TabsTrigger>
                <TabsTrigger value="testimonios">Testimonios</TabsTrigger>
              </TabsList>

              <TabsContent value="temario" className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5" />
                    Objetivo del Nivel
                  </h4>
                  <p className="text-sm text-blue-700">
                    {level.infoNivel.descripcion || "Dominar las estructuras fundamentales y comunicarse en situaciones cotidianas con confianza."}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Módulos Principales:</h4>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {['Gramática Esencial', 'Vocabulario Práctico', 'Comprensión Auditiva', 'Expresión Oral', 'Lectura Comprensiva', 'Escritura Efectiva'].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="metodologia">
                <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                  <p>
                    Nuestra metodología combina clases en vivo con práctica autónoma en plataforma digital.
                  </p>
                  <ul className="space-y-3 mt-4">
                    <li className="flex gap-3">
                      <div className="bg-primary/10 p-2 rounded text-primary">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <strong className="block text-gray-900">Libro Digital + Físico</strong>
                        Material oficial incluido en tu matrícula.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="bg-primary/10 p-2 rounded text-primary">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <strong className="block text-gray-900">Role-playing</strong>
                        Simulaciones de situaciones reales en cada clase.
                      </div>
                    </li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="testimonios">
                <div className="grid gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <Quote className="h-6 w-6 text-gray-300 mb-2" />
                      <p className="text-sm text-gray-600 italic mb-3">
                        "Increíble experiencia. Los profesores realmente se preocupan porque aprendas y no solo memorices. En 4 meses avancé lo que no pude en años."
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-gray-300 rounded-full" />
                        <div>
                          <p className="text-xs font-bold text-gray-900">Estudiante Graduado</p>
                          <p className="text-[10px] text-gray-500">Nivel {level.infoNivel.codigoVisual}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
