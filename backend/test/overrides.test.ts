import { describe, it, expect } from "vitest";
import {
  applyOverrides,
  recomputeCategorySummary,
  isValidCategory,
  labelFor,
  type OverrideMap,
} from "../src/overrides.js";
import type { Product } from "../src/types.js";

function makeProduct(id: string, category: string, name = "Item"): Product {
  return {
    id,
    name,
    url: `https://example.com/${id}`,
    price: "USD 10,00",
    image: null,
    category,
    categoryLabel: category,
  };
}

describe("overrides", () => {
  it("aplica override e atualiza slug + label", () => {
    const products = [makeProduct("1", "replicas"), makeProduct("2", "miras")];
    const overrides: OverrideMap = { "1": { category: "vestuario" } };

    const res = applyOverrides(products, overrides);

    expect(res.applied).toBe(1);
    expect(products[0].category).toBe("vestuario");
    expect(products[0].categoryLabel).toBe(labelFor("vestuario"));
    // produto não referenciado permanece intacto
    expect(products[1].category).toBe("miras");
  });

  it("não conta como aplicado quando a categoria já é a mesma", () => {
    const products = [makeProduct("1", "miras")];
    const res = applyOverrides(products, { "1": { category: "miras" } });
    expect(res.applied).toBe(0);
  });

  it("reporta ids inexistentes no snapshot", () => {
    const products = [makeProduct("1", "replicas")];
    const res = applyOverrides(products, { "999": { category: "miras" } });
    expect(res.applied).toBe(0);
    expect(res.notFound).toEqual(["999"]);
  });

  it("ignora e reporta categoria destino inválida", () => {
    const products = [makeProduct("1", "replicas")];
    const res = applyOverrides(products, { "1": { category: "categoria-fantasma" } });
    expect(res.applied).toBe(0);
    expect(res.invalidCategory).toEqual(["1"]);
    expect(products[0].category).toBe("replicas"); // não foi tocado
  });

  it("valida slugs conhecidos", () => {
    expect(isValidCategory("miras")).toBe(true);
    expect(isValidCategory("nao-existe")).toBe(false);
  });

  it("recalcula o resumo de categorias após overrides", () => {
    const products = [
      makeProduct("1", "replicas"),
      makeProduct("2", "replicas"),
      makeProduct("3", "miras"),
    ];
    applyOverrides(products, { "2": { category: "miras" } });
    const summary = recomputeCategorySummary(products);

    expect(summary.find((c) => c.slug === "replicas")?.count).toBe(1);
    expect(summary.find((c) => c.slug === "miras")?.count).toBe(2);
  });
});
