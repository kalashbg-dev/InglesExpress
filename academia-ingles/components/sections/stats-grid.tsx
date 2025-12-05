import { Users, GraduationCap, BookOpen, Clock } from "lucide-react";

const stats = [
  {
    id: 1,
    label: "Años de Experiencia",
    value: "15+",
    icon: Clock,
  },
  {
    id: 2,
    label: "Estudiantes Graduados",
    value: "2,500+",
    icon: GraduationCap,
  },
  {
    id: 3,
    label: "Niveles Disponibles",
    value: "6",
    icon: BookOpen,
  },
  {
    id: 4,
    label: "Profesores Nativos",
    value: "25",
    icon: Users,
  },
];

export function StatsGrid() {
  return (
    <section className="bg-primary text-white py-12 -mt-4 relative z-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center text-center space-y-2 group hover:-translate-y-1 transition-transform duration-300">
              <div className="p-3 bg-white/10 rounded-full mb-2 group-hover:bg-white/20 transition-colors">
                <stat.icon className="h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold tracking-tight">{stat.value}</div>
              <div className="text-sm lg:text-base font-medium opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
