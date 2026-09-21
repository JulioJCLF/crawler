"use client";

import { ActiveFilterChip, FilterKey } from "@/lib/activeFilters";

interface ActiveFiltersProps {
  chips: ActiveFilterChip[];
  onRemove: (key: FilterKey) => void;
  onClearAll: () => void;
}

// REQ-017: resumo dos filtros ativos, com opção de remover um por um ou limpar tudo.
export function ActiveFilters({ chips, onRemove, onClearAll }: ActiveFiltersProps) {
  if (chips.length === 0) return null;

  return (
    <div
      data-testid="active-filters"
      className="flex flex-wrap items-center gap-2 mb-6 font-mono text-xs"
    >
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={() => onRemove(chip.key)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted border border-border text-foreground hover:border-destructive/50 transition-colors"
        >
          <span>{chip.label}</span>
          <span aria-hidden="true">&times;</span>
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="px-3 py-1.5 rounded-full border border-border text-muted-foreground uppercase tracking-widest hover:text-destructive hover:border-destructive/50 transition-colors"
      >
        Limpar filtros
      </button>
    </div>
  );
}
