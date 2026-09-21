import { describe, it, expect } from "vitest";
import { detectCategoryDrops } from "./categoryDrop.js";

describe("detectCategoryDrops (REQ-019)", () => {
  it("gera alerta quando uma categoria com 10+ produtos zera", () => {
    const previous = [{ slug: "bbs", label: "BBs", count: 40 }];
    const current = [{ slug: "bbs", label: "BBs", count: 0 }];

    const drops = detectCategoryDrops(current, previous);

    expect(drops).toEqual([
      { slug: "bbs", label: "BBs", previousCount: 40, currentCount: 0 },
    ]);
  });

  it("gera alerta quando uma categoria com 10+ produtos cai 50% ou mais sem zerar", () => {
    const previous = [{ slug: "miras", label: "Miras e Red Dots", count: 100 }];
    const current = [{ slug: "miras", label: "Miras e Red Dots", count: 40 }];

    const drops = detectCategoryDrops(current, previous);

    expect(drops).toHaveLength(1);
    expect(drops[0].slug).toBe("miras");
  });

  it("não gera alerta para categoria com menos de 10 produtos na execução anterior, mesmo zerando", () => {
    const previous = [{ slug: "granadas", label: "Granadas", count: 5 }];
    const current = [{ slug: "granadas", label: "Granadas", count: 0 }];

    expect(detectCategoryDrops(current, previous)).toEqual([]);
  });

  it("não gera alerta para queda abaixo de 50%", () => {
    const previous = [{ slug: "replicas", label: "Réplicas", count: 200 }];
    const current = [{ slug: "replicas", label: "Réplicas", count: 150 }];

    expect(detectCategoryDrops(current, previous)).toEqual([]);
  });

  it("não gera alerta na primeira execução (sem snapshot anterior)", () => {
    const current = [{ slug: "bbs", label: "BBs", count: 0 }];

    expect(detectCategoryDrops(current, null)).toEqual([]);
  });

  it("não trata categoria nova (sem contraparte anterior) como queda", () => {
    const previous = [{ slug: "bbs", label: "BBs", count: 40 }];
    const current = [
      { slug: "bbs", label: "BBs", count: 40 },
      { slug: "buckings", label: "Buckings", count: 0 },
    ];

    expect(detectCategoryDrops(current, previous)).toEqual([]);
  });
});
