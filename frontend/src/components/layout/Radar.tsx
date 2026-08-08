"use client";

import { useState } from "react";
import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { ChevronDown, ChevronUp } from "lucide-react";

export function Radar({ products }: { products: Product[] }) {
  const [isOpen, setIsOpen] = useState(true);

  // Pegamos apenas produtos que tiveram mudança recente ou são novos
  const highlights = products.filter(p => p.changeType === "new" || p.changeType === "restock").slice(0, 10);

  if (highlights.length === 0) return null;

  return (
    <div className="bg-surface border-b border-border bg-card transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-4">
        <div 
          className="flex items-center justify-between cursor-pointer group"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-accent animate-ping shadow-[0_0_8px_var(--accent)]" />
            <h2 className="font-heading font-bold text-lg uppercase tracking-wider text-foreground group-hover:text-accent transition-colors">
              Radar de Novidades
            </h2>
            <span className="font-mono text-[10px] text-muted-foreground ml-2 hidden sm:inline-block">
              Últimas 24h ({highlights.length} itens)
            </span>
          </div>
          <button className="text-muted-foreground group-hover:text-accent transition-colors p-1">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {isOpen && (
          <div className="flex gap-4 overflow-x-auto pt-4 pb-2 scrollbar-hide snap-x mt-2">
            {highlights.map(product => (
              <div key={product.id} className="snap-start flex-none w-[200px] sm:w-[220px]">
                <div className="scale-95 origin-top">
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
