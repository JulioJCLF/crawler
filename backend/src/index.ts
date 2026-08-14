import { runCrawler } from "./crawler.js";
import { loadSnapshot, saveSnapshot, applyChangeTracking } from "./history.js";
import { loadOverrides, applyOverrides } from "./overrides.js";
import { ALL_CATEGORIES } from "./config.js";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SNAPSHOT_PATH = join(__dirname, "..", "snapshot.json");
const OVERRIDES_PATH = join(__dirname, "..", "overrides.json");

async function main() {
  console.log(`[${new Date().toISOString()}] Iniciando crawler com Crawlee...`);
  
  const atuais = await runCrawler();
  
  if (atuais.length === 0) {
    console.error("Nenhum produto extraído — verifique seletores/URLs. Snapshot NÃO atualizado.");
    process.exit(1);
  }

  const snapshot = await loadSnapshot(SNAPSHOT_PATH);
  const agora = new Date().toISOString();

  // Apply tracking logic (history, radar changes)
  applyChangeTracking(atuais, snapshot, agora);

  // Reaplica as correções manuais de categoria (overrides.json). Isso roda
  // DEPOIS do crawl/heurística e ANTES do resumo, então vence a categorização
  // automática e sobrevive a novos crawls.
  const overrides = await loadOverrides(OVERRIDES_PATH);
  const ov = applyOverrides(atuais, overrides);
  if (ov.applied) console.log(`Overrides manuais aplicados: ${ov.applied} item(ns).`);
  if (ov.notFound.length) console.log(`(${ov.notFound.length} override(s) sem produto correspondente no catálogo)`);
  if (ov.invalidCategory.length) console.warn(`Overrides com categoria inválida (ignorados): ${ov.invalidCategory.join(", ")}`);

  const categorySummary = ALL_CATEGORIES.map((c) => ({
    slug: c.slug,
    label: c.label,
    count: atuais.filter((p) => p.category === c.slug).length,
  }));

  if (!snapshot) {
    console.log("Primeira execução — criando baseline, sem alertas.");
  } else {
    // Detect removed items completely
    const idsAtuais = new Set(atuais.map((p) => p.id));
    const removidos = snapshot.products.filter((p) => !idsAtuais.has(p.id));
    if (removidos.length) {
      console.log(`(${removidos.length} produto(s) sumiram do catálogo completamente)`);
    }
  }

  await saveSnapshot(SNAPSHOT_PATH, {
    updatedAt: agora,
    count: atuais.length,
    categories: categorySummary,
    products: atuais
  });
  
  console.log(`Snapshot salvo com sucesso com ${atuais.length} itens.`);
}

main().catch(err => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
