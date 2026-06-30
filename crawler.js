#!/usr/bin/env node
// Arsenal Sports - watcher de produtos novos por categoria
// Node 18+ (fetch nativo). Dep: cheerio.
//   npm i cheerio
//   node crawler.js
//
// Detecta produtos novos comparando com o snapshot anterior (snapshot.json).
// Roda via cron 1x/dia ou 1x/semana (ver README).

import { load } from "cheerio";
import { writeFile, readFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// ---------- CONFIG ----------
const CATEGORY_URL =
  "https://www.arsenalsports.com/produtos/airsoft-replicas-de-airsoft/filter?d=124";
const PAGE_PARAM = "pagina";       // esquema de paginacao do site (?pagina=N)
const MAX_PAGES = 150;             // trava de seguranca
const DELAY_MS = 800;              // educacao com o servidor entre requests
const __dirname = dirname(fileURLToPath(import.meta.url));
const SNAPSHOT_PATH = join(__dirname, "snapshot.json");
// Opcional: webhook pra notificar (Discord / Slack / n8n / seu backend).
// Deixe vazio pra so logar no console.
const WEBHOOK_URL = process.env.WEBHOOK_URL || "";
// ----------------------------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function pageUrl(base, page) {
  if (page === 1) return base;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}${PAGE_PARAM}=${page}`;
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      "Accept-Language": "pt-BR,pt;q=0.9",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} em ${url}`);
  return res.text();
}

// Extrai produtos de uma pagina. Resiliente: ancora nos links /produto/...-ID.html
// em vez de depender de classes CSS (que o tema pode trocar).
function parseProducts(html) {
  const $ = load(html);
  const byId = new Map();

  $('a[href*="/produto/"]').each((_, el) => {
    const href = $(el).attr("href") || "";
    const m = href.match(/\/produto\/.*?-(\d+)\.html/);
    if (!m) return;
    const id = m[1];
    if (byId.has(id)) return;

    const title = ($(el).attr("title") || $(el).text() || "").trim();
    // Card ancestral: dali tiramos preco e imagem
    const card = $(el).closest("div,li,article");
    const priceMatch = card.text().match(/USD\s*([\d.,]+)/);

    // Imagem do produto: src que contem "/produtos/" (logos de marca usam "/marcas/")
    let img =
      card.find('img[src*="/produtos/"]').first().attr("src") ||
      $(el).find("img").first().attr("src") ||
      null;
    if (img && !img.startsWith("http"))
      img = `https://www.arsenalsports.com${img}`;

    byId.set(id, {
      id,
      name: title.replace(/\s+/g, " "),
      url: href.startsWith("http")
        ? href
        : `https://www.arsenalsports.com${href}`,
      price: priceMatch ? `USD ${priceMatch[1]}` : null,
      image: img,
    });
  });

  return [...byId.values()].filter((p) => p.name); // descarta links vazios
}

async function crawlAll() {
  const all = new Map();
  let lastBatchIds = "";

  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = pageUrl(CATEGORY_URL, page);
    let products;
    try {
      products = parseProducts(await fetchHtml(url));
    } catch (e) {
      console.error(`  pagina ${page}: ${e.message} — parando`);
      break;
    }

    if (products.length === 0) {
      console.log(`  pagina ${page}: vazia — fim`);
      break;
    }

    // Protecao: se o param de paginacao estiver errado, o site devolve
    // sempre a pagina 1. Detectamos isso pelo lote identico e paramos.
    const batchIds = products.map((p) => p.id).sort().join(",");
    if (batchIds === lastBatchIds) {
      console.log(`  pagina ${page}: lote repetido — fim da paginacao`);
      break;
    }
    lastBatchIds = batchIds;

    let novosNaPagina = 0;
    for (const p of products) {
      if (!all.has(p.id)) {
        all.set(p.id, p);
        novosNaPagina++;
      }
    }
    console.log(`  pagina ${page}: ${products.length} itens (${novosNaPagina} unicos)`);

    if (novosNaPagina === 0) break; // nada novo => acabou
    await sleep(DELAY_MS);
  }

  return [...all.values()];
}

async function loadSnapshot() {
  try {
    return JSON.parse(await readFile(SNAPSHOT_PATH, "utf8"));
  } catch {
    return null; // primeira execucao
  }
}

const DISCORD_LIMIT = 1900; // margem de seguranca sob o limite real de 2000

function splitIntoChunks(linhas, header) {
  const chunks = [];
  let atual = header;
  for (const linha of linhas) {
    if ((atual + "\n" + linha).length > DISCORD_LIMIT) {
      chunks.push(atual);
      atual = linha;
    } else {
      atual += "\n" + linha;
    }
  }
  if (atual) chunks.push(atual);
  return chunks;
}

async function notify(novos) {
  const linhas = novos.map(
    (p) => `• ${p.name}${p.price ? ` — ${p.price}` : ""}\n  ${p.url}`
  );
  const header = `🆕 ${novos.length} produto(s) novo(s) na Arsenal Sports:`;
  const msgCompleta = `${header}\n\n${linhas.join("\n")}`;
  console.log("\n" + msgCompleta);

  if (!WEBHOOK_URL) {
    console.log("(WEBHOOK_URL nao configurada — pulando envio)");
    return;
  }

  const chunks = splitIntoChunks(linhas, header + "\n");

  for (let i = 0; i < chunks.length; i++) {
    const body =
      chunks.length > 1 ? `${chunks[i]}\n(parte ${i + 1}/${chunks.length})` : chunks[i];
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: body,
          text: body,
          count: novos.length,
          produtos: novos,
        }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error(`webhook falhou: HTTP ${res.status} — ${txt}`);
      } else {
        console.log(`→ webhook enviado (${i + 1}/${chunks.length})`);
      }
    } catch (e) {
      console.error("webhook falhou:", e.message);
    }
    if (chunks.length > 1) await sleep(700); // evita rate limit do Discord
  }
}

async function main() {
  console.log(`[${new Date().toISOString()}] crawling ${CATEGORY_URL}`);
  const atuais = await crawlAll();
  console.log(`Total atual: ${atuais.length} produtos`);

  if (atuais.length === 0) {
    console.error("Nenhum produto extraido — verifique seletor/URL. Snapshot NAO atualizado.");
    process.exit(1);
  }

  const snapshot = await loadSnapshot();
  const agora = new Date().toISOString();

  // Mapa de firstSeen do snapshot anterior, pra preservar a data original
  const firstSeenAntigo = new Map(
    (snapshot?.products || []).map((p) => [p.id, p.firstSeen])
  );
  for (const p of atuais) {
    p.firstSeen = firstSeenAntigo.get(p.id) || agora;
  }

  if (!snapshot) {
    console.log("Primeira execucao — criando baseline, sem alertas.");
  } else {
    const idsAntigos = new Set(snapshot.products.map((p) => p.id));
    const novos = atuais.filter((p) => !idsAntigos.has(p.id));
    const idsAtuais = new Set(atuais.map((p) => p.id));
    const removidos = snapshot.products.filter((p) => !idsAtuais.has(p.id));

    if (novos.length) await notify(novos);
    else console.log("Nenhum produto novo.");

    if (removidos.length)
      console.log(`(${removidos.length} produto(s) sumiram do catalogo)`);
  }

  await mkdir(dirname(SNAPSHOT_PATH), { recursive: true });
  await writeFile(
    SNAPSHOT_PATH,
    JSON.stringify(
      { updatedAt: agora, count: atuais.length, products: atuais },
      null,
      2
    )
  );
  console.log(`Snapshot salvo em ${SNAPSHOT_PATH}`);
}

main().catch((e) => {
  console.error("Erro fatal:", e);
  process.exit(1);
});
