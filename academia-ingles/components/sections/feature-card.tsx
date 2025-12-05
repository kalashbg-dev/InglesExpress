import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-100">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-50 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="font-bold text-gray-900 mb-2 text-lg">{title}</h3>
        <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
      </div>
    </div>
  );
}
