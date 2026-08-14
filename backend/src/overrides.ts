import { readFile, writeFile } from "node:fs/promises";
import type { Product, CategorySummary } from "./types.js";
import { ALL_CATEGORIES as CATEGORIES } from "./config.js";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CAMADA DE OVERRIDES MANUAIS DE CATEGORIA
 * ─────────────────────────────────────────────────────────────────────────────
 *  O crawler reconstrói o snapshot do zero a cada execução, então qualquer
 *  correção feita "na mão" no snapshot seria perdida no próximo crawl.
 *
 *  Este módulo mantém um arquivo persistente (overrides.json) mapeando o ID do
 *  produto para a categoria correta. Esses overrides são reaplicados SEMPRE,
 *  depois do crawl e antes de salvar o snapshot — logo, vencem a heurística
 *  automática e sobrevivem a novos crawls.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface OverrideEntry {
  /** Slug de categoria destino (precisa existir em CATEGORIES). */
  category: string;
  /** Motivo opcional, só pra você lembrar depois. */
  note?: string;
  /** Quando o override foi criado/alterado (ISO). */
  updatedAt?: string;
}

/** id do produto -> override */
export type OverrideMap = Record<string, OverrideEntry>;

const LABEL_BY_SLUG = new Map(CATEGORIES.map((c) => [c.slug, c.label]));
export const VALID_CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

export function isValidCategory(slug: string): boolean {
  return LABEL_BY_SLUG.has(slug);
}

export function labelFor(slug: string): string {
  return LABEL_BY_SLUG.get(slug) ?? slug;
}

/** Lê overrides.json. Aceita valor string ("slug") ou objeto {category, note}. */
export async function loadOverrides(path: string): Promise<OverrideMap> {
  try {
    const raw = await readFile(path, "utf8");
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const map: OverrideMap = {};
    for (const [id, val] of Object.entries(parsed)) {
      if (typeof val === "string") {
        map[id] = { category: val };
      } else if (val && typeof val === "object" && typeof (val as OverrideEntry).category === "string") {
        const e = val as OverrideEntry;
        map[id] = { category: e.category, note: e.note, updatedAt: e.updatedAt };
      }
    }
    return map;
  } catch {
    return {};
  }
}

/** Salva overrides.json ordenado por id (diffs estáveis no git). */
export async function saveOverrides(path: string, overrides: OverrideMap): Promise<void> {
  const ordered: OverrideMap = {};
  const ids = Object.keys(overrides).sort(
    (a, b) => (Number(a) || 0) - (Number(b) || 0) || a.localeCompare(b),
  );
  for (const id of ids) ordered[id] = overrides[id];
  await writeFile(path, JSON.stringify(ordered, null, 2) + "\n");
}

export interface ApplyResult {
  /** Quantos produtos tiveram a categoria efetivamente alterada. */
  applied: number;
  /** IDs de override cuja categoria destino é inválida. */
  invalidCategory: string[];
  /** IDs de override que não existem no snapshot atual (produto sumiu?). */
  notFound: string[];
}

/**
 * Aplica os overrides sobre a lista de produtos (muta em memória).
 * Retorna estatísticas para logging.
 */
export function applyOverrides(products: Product[], overrides: OverrideMap): ApplyResult {
  const byId = new Map(products.map((p) => [p.id, p]));
  const result: ApplyResult = { applied: 0, invalidCategory: [], notFound: [] };

  for (const [id, entry] of Object.entries(overrides)) {
    if (!isValidCategory(entry.category)) {
      result.invalidCategory.push(id);
      continue;
    }
    const product = byId.get(id);
    if (!product) {
      result.notFound.push(id);
      continue;
    }
    if (product.category !== entry.category) {
      product.category = entry.category;
      product.categoryLabel = labelFor(entry.category);
      result.applied++;
    }
  }

  return result;
}

/** Recalcula o resumo de categorias a partir dos produtos já com overrides aplicados. */
export function recomputeCategorySummary(products: Product[]): CategorySummary[] {
  return CATEGORIES.map((c) => ({
    slug: c.slug,
    label: c.label,
    count: products.filter((p) => p.category === c.slug).length,
  }));
}
