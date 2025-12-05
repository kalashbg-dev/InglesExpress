import { BadgeCheck } from "lucide-react";

export function DirectorCard() {
  return (
    <div className="relative">
      <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gray-200 relative group">
        {/* Placeholder Image */}
        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500 font-medium">Director Image</span>
        </div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 p-6 w-full text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Director Académico
            </span>
          </div>
          <h3 className="text-xl font-bold mb-1">Vladimir Umaña</h3>
          <p className="text-gray-300 text-sm">15 Años de Experiencia en Educación</p>
        </div>
      </div>

      {/* Certification Badge */}
      <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3 animate-bounce-slow">
        <div className="bg-blue-50 text-blue-600 p-2 rounded-full">
          <BadgeCheck className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase">Certificado</p>
          <p className="font-bold text-gray-900">Estándar CEFR</p>
        </div>
      </div>
    </div>
  );
}
