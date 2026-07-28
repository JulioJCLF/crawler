import { runCrawler } from "./crawler.js";
import { loadSnapshot, saveSnapshot, applyChangeTracking } from "./history.js";
import { notifyChanges } from "./notifier.js";
import { CATEGORIES } from "./config.js";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SNAPSHOT_PATH = join(__dirname, "..", "snapshot.json");

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

  const categorySummary = CATEGORIES.map((c) => ({
    slug: c.slug,
    label: c.label,
    count: atuais.filter((p) => p.category === c.slug).length,
  }));

  if (!snapshot) {
    console.log("Primeira execução — criando baseline, sem alertas.");
  } else {
    // Notify about changes
    const changedProducts = atuais.filter(p => p.changeType);
    if (changedProducts.length > 0) {
      await notifyChanges(changedProducts);
    } else {
      console.log("Nenhuma alteração detectada no catálogo.");
    }
    
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
