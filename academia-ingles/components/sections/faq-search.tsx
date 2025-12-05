'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";

interface FAQSearchProps {
  onSearch: (query: string) => void;
  onFilter: (category: 'all' | 'academic' | 'administrative') => void;
}

export function FAQSearch({ onSearch, onFilter }: FAQSearchProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'academic' | 'administrative'>('all');

  const handleFilter = (category: 'all' | 'academic' | 'administrative') => {
    setActiveFilter(category);
    onFilter(category);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
      {/* Search Input */}
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar pregunta frecuente..."
          className="pl-10 h-12 bg-white"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-full md:w-auto">
        <Button
          variant={activeFilter === 'all' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleFilter('all')}
          className="flex-1 md:flex-none rounded-md"
        >
          Todas
        </Button>
        <Button
          variant={activeFilter === 'academic' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleFilter('academic')}
          className="flex-1 md:flex-none rounded-md"
        >
          Académico
        </Button>
        <Button
          variant={activeFilter === 'administrative' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleFilter('administrative')}
          className="flex-1 md:flex-none rounded-md"
        >
          Administrativo
        </Button>
      </div>
    </div>
  );
}
