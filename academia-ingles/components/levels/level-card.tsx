'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, ArrowRight } from "lucide-react";
import { LevelDetailModal } from "./level-detail-modal";
import { cn } from "@/lib/utils";

interface LevelCardProps {
  level: {
    id: number;
    title: string;
    slug: string;
    infoNivel: {
      codigoVisual: string;
      duracion: string;
      precio: number;
      descripcion?: string;
      linkPago: string;
      imagenLibro: {
        sourceUrl: string;
        altText: string;
      };
    };
  };
}

export function LevelCard({ level }: LevelCardProps) {
  // Determine color based on level code (A1/A2 = Red/Orange, B1/B2 = Blue/Green, C = Purple)
  const getLevelColor = (code: string) => {
    if (code.startsWith('A')) return 'bg-red-500';
    if (code.startsWith('B')) return 'bg-blue-500';
    return 'bg-purple-500';
  };

  const levelColor = getLevelColor(level.infoNivel.codigoVisual);

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-gray-200 bg-white h-full flex flex-col">
      {/* Header Strip */}
      <div className={cn("h-3 w-full", levelColor)} />

      {/* Level Badge */}
      <div className={cn(
        "absolute top-6 right-6 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md",
        levelColor
      )}>
        {level.infoNivel.codigoVisual}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* 3D Book Image Area */}
        <div className="relative h-48 mb-6 perspective-1000 flex items-center justify-center">
          <div className="relative w-32 h-40 transition-transform duration-500 transform rotate-y-12 group-hover:rotate-y-18 group-hover:scale-105 preserve-3d shadow-2xl">
            {/* Book Spine/Cover Simulation */}
            <div className={cn("absolute inset-0 rounded-r-md shadow-inner", levelColor, "opacity-20")} />

            {/* Actual Image Placeholder since we don't have real images yet */}
            <div className="absolute inset-0 bg-white border border-gray-200 rounded-r-md overflow-hidden flex items-center justify-center">
               {/* In production use next/image here */}
               <div className="text-center p-2">
                 <div className={cn("text-4xl font-black opacity-20", levelColor.replace('bg-', 'text-'))}>
                   {level.infoNivel.codigoVisual}
                 </div>
               </div>
            </div>

            {/* Book Side Effect */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gray-100 transform -translate-x-full origin-right skew-y-12 border border-gray-300" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
          {level.title}
        </h3>

        <p className="text-gray-600 text-sm mb-6 line-clamp-2 flex-grow">
          {level.infoNivel.descripcion || "Domina este nivel con nuestra metodología acelerada y profesores expertos."}
        </p>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-primary" />
            <span>{level.infoNivel.duracion}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-900 font-bold">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span>RD$ {level.infoNivel.precio.toLocaleString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto">
          <LevelDetailModal
            level={level}
            trigger={
              <Button className="w-full group-hover:bg-primary group-hover:text-white transition-colors gap-2" variant="outline">
                Ver Temario
                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </Button>
            }
          />
        </div>
      </div>
    </Card>
  );
}
