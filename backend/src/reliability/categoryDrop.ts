// REQ-019: detecta queda brusca de produtos numa categoria, comparando com a
// execução anterior, antes do snapshot ser sobrescrito.

export interface CategoryCount {
  slug: string;
  label: string;
  count: number;
}

export interface CategoryDrop {
  slug: string;
  label: string;
  previousCount: number;
  currentCount: number;
}

// RN3: piso de produtos na execução anterior para a categoria entrar na checagem.
export const CATEGORY_DROP_MIN_PREVIOUS_COUNT = 10;

// RN4: fração de queda (em relação à execução anterior) que conta como "brusca".
export const CATEGORY_DROP_RATIO = 0.5;

// RN1/RN3/RN4: compara categoria a categoria com a execução anterior.
// Sem snapshot anterior (primeira execução), não há o que comparar.
// Categoria nova (sem contraparte anterior) não conta como queda.
export function detectCategoryDrops(
  currentCategories: CategoryCount[],
  previousCategories: CategoryCount[] | null
): CategoryDrop[] {
  if (!previousCategories) return [];

  const previousBySlug = new Map(previousCategories.map((c) => [c.slug, c]));
  const drops: CategoryDrop[] = [];

  for (const current of currentCategories) {
    const previous = previousBySlug.get(current.slug);
    if (!previous) continue;
    if (previous.count < CATEGORY_DROP_MIN_PREVIOUS_COUNT) continue;

    const droppedToZero = current.count === 0;
    const dropRatio = (previous.count - current.count) / previous.count;

    if (droppedToZero || dropRatio >= CATEGORY_DROP_RATIO) {
      drops.push({
        slug: current.slug,
        label: current.label,
        previousCount: previous.count,
        currentCount: current.count,
      });
    }
  }

  return drops;
}
