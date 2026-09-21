import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ActiveFilters } from "./ActiveFilters";

describe("ActiveFilters", () => {
  it("não renderiza nada quando não há filtro ativo", () => {
    const { container } = render(
      <ActiveFilters chips={[]} onRemove={vi.fn()} onClearAll={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("mostra um resumo com os filtros ativos", () => {
    render(
      <ActiveFilters
        chips={[{ key: "category", label: "Rifles AEG" }]}
        onRemove={vi.fn()}
        onClearAll={vi.fn()}
      />
    );
    expect(screen.getByTestId("active-filters")).toBeInTheDocument();
    expect(screen.getByText("Rifles AEG")).toBeInTheDocument();
  });

  it("remove só o filtro clicado, chamando onRemove com a chave certa", async () => {
    const onRemove = vi.fn();
    const user = userEvent.setup();
    render(
      <ActiveFilters
        chips={[
          { key: "category", label: "Rifles AEG" },
          { key: "brand", label: "KWA" },
        ]}
        onRemove={onRemove}
        onClearAll={vi.fn()}
      />
    );

    await user.click(screen.getByText("KWA"));

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledWith("brand");
  });

  it("aciona onClearAll ao clicar em Limpar filtros", async () => {
    const onClearAll = vi.fn();
    const user = userEvent.setup();
    render(
      <ActiveFilters
        chips={[{ key: "search", label: 'Busca: "hop up"' }]}
        onRemove={vi.fn()}
        onClearAll={onClearAll}
      />
    );

    await user.click(screen.getByText("Limpar filtros"));

    expect(onClearAll).toHaveBeenCalledTimes(1);
  });
});
