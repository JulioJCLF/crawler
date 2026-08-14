"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { Input } from "@/components/ui/input";
import { CategorySummary } from "@/types";
import { Logo } from "@/components/layout/Logo";

interface FiltersProps {
  categories: CategorySummary[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  search: string;
  onSearchChange: (search: string) => void;
  totalCount: number;
  selectedWeight: string | null;
  onSelectWeight: (weight: string | null) => void;
  selectedVestCategory: string | null;
  onSelectVestCategory: (vestCat: string | null) => void;
  selectedBrand: string | null;
  onSelectBrand: (brand: string | null) => void;
  sortOrder: string;
  onSortChange: (sort: string) => void;
  availableBrands: string[];
}

const MACRO_CATEGORIES = [
  { slug: "#aeg", label: "Rifles AEG" },
  { slug: "#gbbr", label: "Rifles GBBR" },
  { slug: "#gbb", label: "Pistolas GBB" },
  { slug: "#spring", label: "Snipers / Spring" },
  { slug: "#miras", label: "Red Dots e Miras" },
  { slug: "#luz", label: "Lanternas e Lasers" },
  { slug: "#mount", label: "Trilhos e Mounts" },
  { slug: "#pecas-internas", label: "Peças Internas" },
  { slug: "buckings", label: "Buckings" },
  { slug: "#pecas-externas", label: "Peças Externas" },
  { slug: "#vestuario", label: "Vestuário Tático" },
  { slug: "#bbs", label: "Munição (BBs)" },
  { slug: "#suprimentos", label: "Gás e Baterias" },
];

const BB_WEIGHTS = ["0.20g", "0.23g", "0.25g", "0.28g", "0.30g", "0.32g", "0.36g", "0.40g", "0.43g", "0.45g", "0.48g", "0.50g"];

// Definindo as Regex no backend/page, aqui mandamos apenas as chaves.
export const VEST_CATEGORIES = [
  { value: "holsters", label: "Holsters" },
  { value: "helmets", label: "Helmets" },
  { value: "headsets", label: "Headsets / Comms" },
  { value: "gloves", label: "Gloves" },
  { value: "vests", label: "Vests & Carriers" },
  { value: "belts", label: "Belts" },
  { value: "uniforms", label: "Uniforms & Apparel" },
  { value: "slings", label: "Slings" },
  { value: "backpacks", label: "Backpacks & Bags" },
  { value: "eyewear", label: "Eyewear & Masks" },
];

export function Filters({
  selectedCategory,
  onSelectCategory,
  search,
  onSearchChange,
  totalCount,
  selectedWeight,
  onSelectWeight,
  selectedVestCategory,
  onSelectVestCategory,
  selectedBrand,
  onSelectBrand,
  sortOrder,
  onSortChange,
  availableBrands
}: FiltersProps) {
  const { layout } = useTheme();

  const isReplicaCategory = selectedCategory === "#aeg" || selectedCategory === "#gbb" || selectedCategory === "#gbbr" || selectedCategory === "#spring" || selectedCategory === "replicas";

  if (layout === "topbar") {
    return (
      <div className="bg-card border-b border-border p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <Logo className="h-12 w-auto object-contain flex-shrink-0" />
        <div className="w-full md:max-w-[800px] flex gap-2 flex-wrap">
          <Input 
            placeholder="Buscar código ou nome..." 
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="font-mono text-sm w-full md:w-auto flex-1"
          />
          
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
            className="font-mono text-xs px-2 py-2 rounded-md bg-background border border-border flex-1 md:flex-none"
          >
            <option value="recent">Recentes</option>
            <option value="asc">A-Z</option>
            <option value="price_asc">Menor Preço</option>
            <option value="price_desc">Maior Preço</option>
          </select>

          {isReplicaCategory && (
            <select
              value={selectedBrand || ""}
              onChange={(e) => onSelectBrand(e.target.value || null)}
              className="font-mono text-xs px-2 py-2 rounded-md bg-background border border-border flex-1 md:flex-none"
            >
              <option value="">Todas Marcas</option>
              {availableBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
            </select>
          )}

          {selectedCategory === "#bbs" && (
            <select
              value={selectedWeight || ""}
              onChange={(e) => onSelectWeight(e.target.value || null)}
              className="font-mono text-xs px-2 py-2 rounded-md bg-background border border-border flex-1 md:flex-none"
            >
              <option value="">Qualquer Peso</option>
              {BB_WEIGHTS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          )}

          {selectedCategory === "#vestuario" && (
            <select
              value={selectedVestCategory || ""}
              onChange={(e) => onSelectVestCategory(e.target.value || null)}
              className="font-mono text-xs px-2 py-2 rounded-md bg-background border border-border flex-1 md:flex-none"
            >
              <option value="">All Gear</option>
              {VEST_CATEGORIES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
            </select>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-hide">
          <button
            onClick={() => onSelectCategory(null)}
            className={`flex-shrink-0 font-mono text-xs px-4 py-2 rounded-full border transition-colors ${
              selectedCategory === null 
                ? "bg-primary text-primary-foreground border-primary font-bold" 
                : "bg-background text-muted-foreground border-border hover:border-primary/50"
            }`}
          >
            Todas ({totalCount})
          </button>
          {MACRO_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => {
                onSelectCategory(cat.slug);
                if (cat.slug !== "#bbs") onSelectWeight(null);
                if (cat.slug !== "#vestuario") onSelectVestCategory(null);
                if (cat.slug !== "#aeg" && cat.slug !== "#gbb" && cat.slug !== "#gbbr" && cat.slug !== "#spring") onSelectBrand(null);
              }}
              className={`flex-shrink-0 font-mono text-xs px-4 py-2 rounded-full border transition-colors ${
                selectedCategory === cat.slug
                  ? "bg-primary text-primary-foreground border-primary font-bold"
                  : "bg-background text-muted-foreground border-border hover:border-primary/50"
              }`}
            >
              <span className="uppercase">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Default Sidebar Layout
  return (
    <aside className="w-full md:w-72 border-r border-border bg-card/30 p-6 flex flex-col gap-6 sticky top-0 h-screen overflow-y-auto">
      <div className="flex justify-center border-b border-border pb-5">
        <Logo className="h-24 w-auto object-contain" />
      </div>

      <div>
        <h2 className="font-heading font-bold text-2xl tracking-tighter uppercase mb-1 text-foreground">Filtros Táticos</h2>
        <p className="text-xs text-muted-foreground font-mono">
          {totalCount} itens na varredura
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
            Ordenação
          </label>
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full font-mono text-sm p-2 rounded-md bg-background border border-border text-foreground"
          >
            <option value="recent">Recentes (Adicionados)</option>
            <option value="asc">Alfabética (A-Z)</option>
            <option value="price_asc">Menor Preço</option>
            <option value="price_desc">Maior Preço</option>
          </select>
        </div>

        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
            Busca por Palavra-chave
          </label>
          <Input 
            placeholder="Código ou nome..." 
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="font-mono text-sm bg-background border-border"
          />
        </div>

        {isReplicaCategory && (
          <div className="p-3 bg-muted/20 border border-border rounded-md">
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
              Fabricante (Marca)
            </label>
            <select
              value={selectedBrand || ""}
              onChange={(e) => onSelectBrand(e.target.value || null)}
              className="w-full font-mono text-sm p-2 rounded-md bg-background border border-border text-foreground"
            >
              <option value="">Todas Marcas</option>
              {availableBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
            </select>
          </div>
        )}

        {selectedCategory === "#bbs" && (
          <div className="p-3 bg-muted/20 border border-border rounded-md">
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
              Peso da Munição
            </label>
            <select
              value={selectedWeight || ""}
              onChange={(e) => onSelectWeight(e.target.value || null)}
              className="w-full font-mono text-sm p-2 rounded-md bg-background border border-border text-foreground"
            >
              <option value="">Qualquer Peso</option>
              {BB_WEIGHTS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
        )}

        {selectedCategory === "#vestuario" && (
          <div className="p-3 bg-muted/20 border border-border rounded-md">
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
              Categoria de Equipamento
            </label>
            <select
              value={selectedVestCategory || ""}
              onChange={(e) => onSelectVestCategory(e.target.value || null)}
              className="w-full font-mono text-sm p-2 rounded-md bg-background border border-border text-foreground"
            >
              <option value="">All Gear</option>
              {VEST_CATEGORIES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
            </select>
          </div>
        )}

        <div>
          <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3 border-b border-border pb-2">
            Categorias-Alvo
          </h3>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => {
                onSelectCategory(null);
                onSelectBrand(null);
              }}
              className={`text-left font-mono text-xs px-3 py-2.5 rounded-md transition-colors ${
                selectedCategory === null 
                  ? "bg-primary text-primary-foreground font-bold shadow-[0_0_10px_var(--primary)_inset]" 
                  : "hover:bg-muted text-muted-foreground border border-transparent hover:border-border"
              }`}
            >
              TUDO
            </button>
            {MACRO_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => {
                  onSelectCategory(cat.slug);
                  if (cat.slug !== "#bbs") onSelectWeight(null);
                  if (cat.slug !== "#vestuario") onSelectVestCategory(null);
                  if (cat.slug !== "#aeg" && cat.slug !== "#gbb" && cat.slug !== "#gbbr" && cat.slug !== "#spring") onSelectBrand(null);
                }}
                className={`flex items-center justify-between font-mono text-xs px-3 py-2.5 rounded-md transition-colors ${
                  selectedCategory === cat.slug
                    ? "bg-primary text-primary-foreground font-bold shadow-[0_0_10px_var(--primary)_inset]"
                    : "hover:bg-muted text-muted-foreground border border-transparent hover:border-border"
                }`}
              >
                <span className="uppercase truncate mr-2">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
