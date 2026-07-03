#!/usr/bin/env node
// Arsenal Sports - watcher multi-categoria
// Node 18+ (fetch nativo). Dep: cheerio.
//   npm i cheerio
//   node crawler.js

import { load } from "cheerio";
import { writeFile, readFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// ---------- CONFIG ----------
const CATEGORIES = [
  { slug: "airsoft-replicas",       label: "Réplicas Airsoft",        url: "https://www.arsenalsports.com/produtos/airsoft-replicas-de-airsoft/filter?d=124" },
  { slug: "partes-e-acessorios",    label: "Partes e Acessórios",     url: "https://www.arsenalsports.com/produtos/partes-e-acessorios/filter?d=1" },
  { slug: "otica-e-iluminacao",     label: "Ótica e Iluminação",      url: "https://www.arsenalsports.com/produtos/otica-e-iluminacao/filter?d=273" },
  { slug: "equipamento-vestuario",  label: "Equipamento e Vestuário", url: "https://www.arsenalsports.com/produtos/equipamento-e-vestuario/filter?d=381" },
  { slug: "airgun",                 label: "Airgun",                  url: "https://www.arsenalsports.com/produtos/airgun/filter?d=34" },
  { slug: "paintball",              label: "Paintball",               url: "https://www.arsenalsports.com/produtos/paintball/filter?d=307" },
  { slug: "gel-blasters",           label: "Gel Blasters",            url: "https://www.arsenalsports.com/produtos/gel-blasters/filter?d=619" },
  { slug: "arco-e-flecha",          label: "Arco e Flecha",           url: "https://www.arsenalsports.com/produtos/arco-e-flecha/filter?d=43" },
  { slug: "defesa-pessoal",         label: "Defesa Pessoal",          url: "https://www.arsenalsports.com/produtos/marcadores-nao-letais--defesa-pessoal/filter?d=1563" },
  { slug: "modelismo-rc",           label: "Modelismo RC",            url: "https://www.arsenalsports.com/produtos/modelismo-radio-controller/filter?d=1653" },
];

const PAGE_PARAM  = "pagina";
const MAX_PAGES   = 150;
const DELAY_MS    = 800;   // entre paginas da mesma categoria
const CAT_DELAY   = 2000;  // entre categorias
const __dirname   = dirname(fileURLToPath(import.meta.url));
const SNAPSHOT_PATH = join(__dirname, "snapshot.json");
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
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      "Accept-Language": "pt-BR,pt;q=0.9",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} em ${url}`);
  return res.text();
}

function parseProducts(html, cat) {
  const $ = load(html);
  const byId = new Map();

  $('a[href*="/produto/"]').each((_, el) => {
    const href = $(el).attr("href") || "";
    const m = href.match(/\/produto\/.*?-(\d+)\.html/);
    if (!m) return;
    const id = m[1];
    if (byId.has(id)) return;

    const title = ($(el).attr("title") || $(el).text() || "").trim();
    const card = $(el).closest("div,li,article");
    const priceMatch = card.text().match(/USD\s*([\d.,]+)/);

    let img =
      card.find('img[src*="/produtos/"]').first().attr("src") ||
      $(el).find("img").first().attr("src") ||
      null;
    if (img && !img.startsWith("http"))
      img = `https://www.arsenalsports.com${img}`;

    byId.set(id, {
      id,
      name: title.replace(/\s+/g, " "),
      url: href.startsWith("http") ? href : `https://www.arsenalsports.com${href}`,
      price: priceMatch ? `USD ${priceMatch[1]}` : null,
      image: img,
      category: cat.slug,
      categoryLabel: cat.label,
    });
  });

  return [...byId.values()].filter((p) => p.name);
}

async function crawlCategory(cat) {
  const all = new Map();
  let lastBatchIds = "";

  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = pageUrl(cat.url, page);
    let products;
    try {
      products = parseProducts(await fetchHtml(url), cat);
    } catch (e) {
      console.error(`  [${cat.slug}] pagina ${page}: ${e.message} — parando`);
      break;
    }

    if (products.length === 0) {
      console.log(`  [${cat.slug}] pagina ${page}: vazia — fim`);
      break;
    }

    const batchIds = products.map((p) => p.id).sort().join(",");
    if (batchIds === lastBatchIds) {
      console.log(`  [${cat.slug}] pagina ${page}: lote repetido — fim da paginacao`);
      break;
    }
    lastBatchIds = batchIds;

    let novosNaPagina = 0;
    for (const p of products) {
      if (!all.has(p.id)) { all.set(p.id, p); novosNaPagina++; }
    }
    console.log(`  [${cat.slug}] pagina ${page}: ${products.length} itens (${novosNaPagina} unicos)`);

    if (novosNaPagina === 0) break;
    await sleep(DELAY_MS);
  }

  return [...all.values()];
}

async function crawlAll() {
  const allById = new Map();

  for (const cat of CATEGORIES) {
    console.log(`\nCrawling [${cat.slug}]...`);
    let products;
    try {
      products = await crawlCategory(cat);
    } catch (e) {
      console.error(`Falha na categoria ${cat.slug}: ${e.message} — continuando`);
      products = [];
    }
    let newInCat = 0;
    for (const p of products) {
      if (!allById.has(p.id)) { allById.set(p.id, p); newInCat++; }
    }
    console.log(`  → ${products.length} produtos, ${newInCat} novos unicos`);
    await sleep(CAT_DELAY);
  }

  return [...allById.values()];
}

async function loadSnapshot() {
  try { return JSON.parse(await readFile(SNAPSHOT_PATH, "utf8")); }
  catch { return null; }
}

// Detecta mudancas de preco e restock comparando com snapshot anterior.
// Preserva dados de rastreamento existentes quando nao ha mudanca.
function applyChangeTracking(atuais, snapshot, agora) {
  const oldById = new Map((snapshot?.products || []).map((p) => [p.id, p]));

  for (const p of atuais) {
    const old = oldById.get(p.id);
    p.firstSeen = old?.firstSeen || agora;

    if (!old) continue; // produto novo, sem historico

    const precoAntes = old.price;
    const precoAgora = p.price;

    if (precoAntes === precoAgora) {
      // sem mudanca: preserva rastreamento anterior
      if (old.priceChangedAt)  p.priceChangedAt  = old.priceChangedAt;
      if (old.changeType)      p.changeType      = old.changeType;
      if (old.previousPrice)   p.previousPrice   = old.previousPrice;
    } else if (!precoAntes && precoAgora) {
      // voltou ao estoque
      p.changeType     = "restock";
      p.priceChangedAt = agora;
      p.previousPrice  = null;
    } else if (precoAntes && !precoAgora) {
      // ficou sem preco (sob consulta / saiu)
      p.changeType     = "sob_consulta";
      p.priceChangedAt = agora;
      p.previousPrice  = precoAntes;
    } else {
      // preco mudou
      p.changeType     = "price_change";
      p.priceChangedAt = agora;
      p.previousPrice  = precoAntes;
    }
  }
}

const DISCORD_LIMIT = 1900;

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
    (p) => `• [${p.categoryLabel || p.category || "?"}] ${p.name}${p.price ? " — " + p.price : ""}\n  ${p.url}`
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
    const body = chunks.length > 1 ? `${chunks[i]}\n(parte ${i + 1}/${chunks.length})` : chunks[i];
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: body, text: body, count: novos.length, produtos: novos }),
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
    if (chunks.length > 1) await sleep(700);
  }
}

async function main() {
  console.log(`[${new Date().toISOString()}] Iniciando crawl de ${CATEGORIES.length} categorias`);
  const atuais = await crawlAll();
  console.log(`\nTotal: ${atuais.length} produtos unicos`);

  if (atuais.length === 0) {
    console.error("Nenhum produto extraido — verifique seletores/URLs. Snapshot NAO atualizado.");
    process.exit(1);
  }

  const snapshot = await loadSnapshot();
  const agora = new Date().toISOString();

  applyChangeTracking(atuais, snapshot, agora);

  const categorySummary = CATEGORIES.map((c) => ({
    slug: c.slug,
    label: c.label,
    count: atuais.filter((p) => p.category === c.slug).length,
  }));

  if (!snapshot) {
    console.log("Primeira execucao — criando baseline, sem alertas.");
  } else {
    const idsAntigos = new Set(snapshot.products.map((p) => p.id));
    const novos = atuais.filter((p) => !idsAntigos.has(p.id));
    const idsAtuais = new Set(atuais.map((p) => p.id));
    const removidos = snapshot.products.filter((p) => !idsAtuais.has(p.id));

    if (novos.length) await notify(novos);
    else console.log("Nenhum produto novo.");
    if (removidos.length) console.log(`(${removidos.length} produto(s) sumiram do catalogo)`);
  }

  await mkdir(dirname(SNAPSHOT_PATH), { recursive: true });
  await writeFile(
    SNAPSHOT_PATH,
    JSON.stringify({ updatedAt: agora, count: atuais.length, categories: categorySummary, products: atuais }, null, 2)
  );
  console.log(`Snapshot salvo em ${SNAPSHOT_PATH}`);
}

main().catch((e) => { console.error("Erro fatal:", e); process.exit(1); });
