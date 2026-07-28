import type { Product } from "./types.js";

const WEBHOOK_URL = process.env.WEBHOOK_URL || "";
const DISCORD_LIMIT = 1900;

export async function notifyChanges(products: Product[]) {
  if (!WEBHOOK_URL) {
    console.log("(WEBHOOK_URL nao configurada — pulando envio discord)");
    return;
  }

  // Group by change type
  const novos = products.filter(p => p.changeType === "new");
  const restock = products.filter(p => p.changeType === "restock"); // ou ganhou preco
  const priceChange = products.filter(p => p.changeType === "price_change");
  const sobConsulta = products.filter(p => p.changeType === "sob_consulta"); // perdeu preco

  const sections: string[] = [];

  if (novos.length) {
    sections.push(`🆕 **${novos.length} NOVO(S) PRODUTO(S)**\n` + novos.map(p => `• [${p.categoryLabel}] ${p.name} — ${p.price}\n  ${p.url}`).join("\n"));
  }
  if (restock.length) {
    sections.push(`🟢 **${restock.length} GANHARAM PREÇO / RESTOCK**\n` + restock.map(p => `• [${p.categoryLabel}] ${p.name} — agora ${p.price}\n  ${p.url}`).join("\n"));
  }
  if (priceChange.length) {
    sections.push(`📈 **${priceChange.length} MUDANÇAS DE PREÇO**\n` + priceChange.map(p => `• [${p.categoryLabel}] ${p.name} — de ${p.previousPrice} para ${p.price}\n  ${p.url}`).join("\n"));
  }
  if (sobConsulta.length) {
    sections.push(`🔴 **${sobConsulta.length} FICARAM SOB CONSULTA (sem preço)**\n` + sobConsulta.map(p => `• [${p.categoryLabel}] ${p.name} — era ${p.previousPrice}\n  ${p.url}`).join("\n"));
  }

  if (sections.length === 0) return;

  const msgCompleta = sections.join("\n\n");
  console.log("\n--- ALERTAS DISCORD ---\n" + msgCompleta + "\n-----------------------");

  // Split into chunks if too large
  const chunks = splitIntoChunks(msgCompleta);
  for (let i = 0; i < chunks.length; i++) {
    const body = chunks.length > 1 ? `${chunks[i]}\n(parte ${i + 1}/${chunks.length})` : chunks[i];
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: body }),
      });
      if (!res.ok) {
        console.error(`Webhook falhou: HTTP ${res.status}`);
      }
    } catch (e) {
      console.error("Webhook exception:", e);
    }
    if (chunks.length > 1) await new Promise(r => setTimeout(r, 700));
  }
}

function splitIntoChunks(text: string): string[] {
  const lines = text.split('\n');
  const chunks: string[] = [];
  let current = "";
  
  for (const line of lines) {
    if ((current + "\n" + line).length > DISCORD_LIMIT) {
      if (current) chunks.push(current);
      current = line;
    } else {
      current += (current ? "\n" : "") + line;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}
