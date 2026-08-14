import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Product, Snapshot } from "./types.js";
import { CATEGORIES } from "./config.js";
import {
  loadOverrides,
  saveOverrides,
  applyOverrides,
  recomputeCategorySummary,
  isValidCategory,
  labelFor,
  VALID_CATEGORY_SLUGS,
  type OverrideMap,
} from "./overrides.js";

/**
 * CLI de controle manual de categorias.
 *
 *   npm run overrides -- <comando> [args] [flags]
 *
 * Comandos:
 *   categories                      Lista as categorias válidas (slug + label + contagem atual)
 *   search <termo...>               Procura itens no snapshot por nome ou id
 *       --cat <slug>                  ...filtra pela categoria atual
 *       --limit <n>                   ...limita resultados (padrão 40)
 *   set <slug> <id...>              Move os ids informados para a categoria <slug>
 *       --note "texto"                ...anota o motivo
 *   move --from <slug> --to <slug>  Migração em LOTE: move itens de uma categoria p/ outra
 *       --match <regex>               ...só os que casam com a regex no nome (opcional)
 *       --limit <n>                   ...máximo de itens (padrão: todos)
 *       --apply                       ...confirma e grava (sem isso é só prévia / dry-run)
 *       --note "texto"                ...anota o motivo
 *   unset <id...>                   Remove os overrides dos ids informados
 *   list                            Lista todos os overrides ativos
 *   apply                           Reaplica os overrides no snapshot.json agora
 *
 * Todo comando que altera overrides já reaplica no snapshot.json local
 * (use --no-apply para só gravar o override sem tocar no snapshot).
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const SNAPSHOT_PATH = join(__dirname, "..", "snapshot.json");
const OVERRIDES_PATH = join(__dirname, "..", "overrides.json");

// ── util de cores/log ────────────────────────────────────────────────────────
const c = {
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
};

// ── parser de argumentos simples ─────────────────────────────────────────────
interface ParsedArgs {
  _: string[];
  flags: Record<string, string | boolean>;
}
function parseArgs(argv: string[]): ParsedArgs {
  const _: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) {
        flags[key] = true;
      } else {
        flags[key] = next;
        i++;
      }
    } else {
      _.push(a);
    }
  }
  return { _, flags };
}

async function loadSnapshotOrExit(): Promise<Snapshot> {
  try {
    return JSON.parse(await readFile(SNAPSHOT_PATH, "utf8")) as Snapshot;
  } catch {
    console.error(c.red(`Não encontrei ${SNAPSHOT_PATH}. Rode o crawler antes (npm start).`));
    process.exit(1);
  }
}

/** Reaplica overrides no snapshot.json e regrava (mantendo contagens corretas). */
async function applyToSnapshotFile(overrides: OverrideMap): Promise<void> {
  const snapshot = await loadSnapshotOrExit();
  const res = applyOverrides(snapshot.products, overrides);
  snapshot.categories = recomputeCategorySummary(snapshot.products);
  await writeFile(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2));
  console.log(
    c.green(`✓ snapshot.json atualizado — ${res.applied} item(ns) na categoria correta.`),
  );
  if (res.notFound.length) {
    console.log(c.yellow(`  (${res.notFound.length} override(s) sem produto no snapshot: ${res.notFound.join(", ")})`));
  }
  if (res.invalidCategory.length) {
    console.log(c.red(`  (categoria inválida em: ${res.invalidCategory.join(", ")})`));
  }
}

function printProduct(p: Product) {
  const price = p.price ? p.price : "sob consulta";
  console.log(
    `  ${c.cyan(p.id.padEnd(8))} ${c.dim("[" + p.category + "]").padEnd(24)} ${p.name} ${c.dim("· " + price)}`,
  );
}

function requireValidCategory(slug: string) {
  if (!isValidCategory(slug)) {
    console.error(c.red(`Categoria inválida: "${slug}".`));
    console.error(`Válidas: ${VALID_CATEGORY_SLUGS.join(", ")}`);
    process.exit(1);
  }
}

// ── comandos ─────────────────────────────────────────────────────────────────

async function cmdCategories() {
  const snapshot = await loadSnapshotOrExit();
  console.log(c.bold("\nCategorias válidas:\n"));
  for (const cat of CATEGORIES) {
    const count = snapshot.products.filter((p) => p.category === cat.slug).length;
    console.log(`  ${c.cyan(cat.slug.padEnd(16))} ${cat.label.padEnd(30)} ${c.dim(String(count).padStart(5) + " itens")}`);
  }
  console.log();
}

async function cmdSearch(args: ParsedArgs) {
  const snapshot = await loadSnapshotOrExit();
  const term = args._.join(" ").toLowerCase().trim();
  const catFilter = typeof args.flags.cat === "string" ? args.flags.cat : null;
  const limit = args.flags.limit ? Number(args.flags.limit) : 40;

  if (!term && !catFilter) {
    console.error(c.red("Informe um termo de busca ou --cat <slug>."));
    process.exit(1);
  }

  let hits = snapshot.products.filter((p) => {
    const matchTerm = !term || p.name.toLowerCase().includes(term) || p.id === term;
    const matchCat = !catFilter || p.category === catFilter;
    return matchTerm && matchCat;
  });

  const total = hits.length;
  hits = hits.slice(0, limit);
  console.log(c.bold(`\n${total} resultado(s)${total > limit ? ` (mostrando ${limit})` : ""}:\n`));
  hits.forEach(printProduct);
  console.log(c.dim(`\nDica: mova com  npm run overrides -- set <categoria> ${hits.slice(0, 2).map((p) => p.id).join(" ")} ...\n`));
}

async function cmdSet(args: ParsedArgs, autoApply: boolean) {
  const [slug, ...ids] = args._;
  if (!slug || ids.length === 0) {
    console.error(c.red("Uso: set <categoria> <id> [id...] [--note \"...\"]"));
    process.exit(1);
  }
  requireValidCategory(slug);
  const note = typeof args.flags.note === "string" ? args.flags.note : undefined;

  const snapshot = await loadSnapshotOrExit();
  const byId = new Map(snapshot.products.map((p) => [p.id, p]));
  const overrides = await loadOverrides(OVERRIDES_PATH);
  const now = new Date().toISOString();

  let changed = 0;
  for (const id of ids) {
    const p = byId.get(id);
    if (!p) {
      console.log(c.yellow(`  ! id ${id} não existe no snapshot — override criado mesmo assim.`));
    } else {
      console.log(`  ${c.cyan(id)} ${c.dim(p.category)} → ${c.green(slug)}  ${c.dim(p.name)}`);
    }
    overrides[id] = { category: slug, note, updatedAt: now };
    changed++;
  }

  await saveOverrides(OVERRIDES_PATH, overrides);
  console.log(c.green(`\n✓ ${changed} override(s) gravado(s) em overrides.json.`));
  if (autoApply) await applyToSnapshotFile(overrides);
  else console.log(c.dim("  (rode `npm run overrides -- apply` para refletir no snapshot)"));
}

async function cmdMove(args: ParsedArgs, autoApply: boolean) {
  const from = args.flags.from;
  const to = args.flags.to;
  if (typeof from !== "string" || typeof to !== "string") {
    console.error(c.red("Uso: move --from <slug> --to <slug> [--match <regex>] [--limit n] [--apply]"));
    process.exit(1);
  }
  requireValidCategory(from);
  requireValidCategory(to);

  const matchStr = typeof args.flags.match === "string" ? args.flags.match : null;
  const matcher = matchStr ? new RegExp(matchStr, "i") : null;
  const limit = args.flags.limit ? Number(args.flags.limit) : Infinity;
  const note = typeof args.flags.note === "string" ? args.flags.note : `lote ${from}→${to}`;
  // "apply" aqui = confirmar a migração (grava). Sem ele é dry-run.
  const confirm = args.flags.apply === true;

  const snapshot = await loadSnapshotOrExit();
  let targets = snapshot.products.filter(
    (p) => p.category === from && (!matcher || matcher.test(p.name)),
  );
  if (Number.isFinite(limit)) targets = targets.slice(0, limit);

  console.log(
    c.bold(
      `\nMigração em lote: ${c.cyan(from)} → ${c.green(to)}` +
        (matcher ? c.dim(`  (match: /${matchStr}/i)`) : "") +
        `\n${targets.length} item(ns) selecionado(s):\n`,
    ),
  );
  targets.forEach(printProduct);

  if (targets.length === 0) {
    console.log(c.yellow("\nNada a migrar.\n"));
    return;
  }

  if (!confirm) {
    console.log(
      c.yellow(`\n[PRÉVIA] Nada foi gravado. Adicione ${c.bold("--apply")} para confirmar a migração.\n`),
    );
    return;
  }

  const overrides = await loadOverrides(OVERRIDES_PATH);
  const now = new Date().toISOString();
  for (const p of targets) overrides[p.id] = { category: to, note, updatedAt: now };
  await saveOverrides(OVERRIDES_PATH, overrides);
  console.log(c.green(`\n✓ ${targets.length} override(s) gravado(s) em overrides.json.`));
  if (autoApply) await applyToSnapshotFile(overrides);
}

async function cmdUnset(args: ParsedArgs, autoApply: boolean) {
  const ids = args._;
  if (ids.length === 0) {
    console.error(c.red("Uso: unset <id> [id...]"));
    process.exit(1);
  }
  const overrides = await loadOverrides(OVERRIDES_PATH);
  let removed = 0;
  for (const id of ids) {
    if (overrides[id]) {
      console.log(`  ${c.cyan(id)} ${c.dim("removido (era → " + overrides[id].category + ")")}`);
      delete overrides[id];
      removed++;
    } else {
      console.log(c.yellow(`  ! ${id} não tinha override.`));
    }
  }
  await saveOverrides(OVERRIDES_PATH, overrides);
  console.log(c.green(`\n✓ ${removed} override(s) removido(s).`));
  if (autoApply) {
    console.log(c.dim("  (reaplicando; itens removidos voltam à categoria automática só no próximo crawl)"));
    await applyToSnapshotFile(overrides);
  }
}

async function cmdList() {
  const overrides = await loadOverrides(OVERRIDES_PATH);
  const entries = Object.entries(overrides);
  if (entries.length === 0) {
    console.log(c.dim("\nNenhum override ativo.\n"));
    return;
  }
  const snapshot = await loadSnapshotOrExit().catch(() => null as unknown as Snapshot);
  const byId = snapshot ? new Map(snapshot.products.map((p) => [p.id, p])) : new Map();
  console.log(c.bold(`\n${entries.length} override(s) ativo(s):\n`));
  for (const [id, e] of entries) {
    const p = byId.get(id);
    const name = p ? p.name : c.yellow("(produto não está no snapshot atual)");
    console.log(
      `  ${c.cyan(id.padEnd(8))} → ${c.green(e.category.padEnd(16))} ${labelFor(e.category).padEnd(24)} ${c.dim(name)}` +
        (e.note ? c.dim(`  — ${e.note}`) : ""),
    );
  }
  console.log();
}

async function cmdApply() {
  const overrides = await loadOverrides(OVERRIDES_PATH);
  await applyToSnapshotFile(overrides);
}

function printHelp() {
  console.log(`
${c.bold("Controle manual de categorias")}

  ${c.dim("npm run overrides -- <comando> [args] [flags]")}

  ${c.cyan("categories")}                          lista categorias válidas + contagem
  ${c.cyan("search")} <termo...> [--cat s] [--limit n]   procura itens no catálogo
  ${c.cyan("set")} <categoria> <id...> [--note ".."]     move ids p/ a categoria
  ${c.cyan("move")} --from s --to s [--match re] [--apply]  migração em LOTE (prévia sem --apply)
  ${c.cyan("unset")} <id...>                        remove overrides
  ${c.cyan("list")}                                 lista overrides ativos
  ${c.cyan("apply")}                                reaplica overrides no snapshot.json

  ${c.dim("Flags globais: --no-apply (não mexe no snapshot ao gravar override)")}

Exemplos:
  npm run overrides -- search "red dot" --cat replicas
  npm run overrides -- set miras 31479 19923 19924 --note "red dots marcados como réplica"
  npm run overrides -- move --from replicas --to magazines --match "magazine|mag\\b"
  npm run overrides -- move --from replicas --to magazines --match "magazine" --apply
`);
}

async function main() {
  const argv = process.argv.slice(2);
  const parsed = parseArgs(argv);
  const cmd = parsed._.shift();
  const autoApply = parsed.flags["no-apply"] !== true;

  switch (cmd) {
    case "categories": return cmdCategories();
    case "search": return cmdSearch(parsed);
    case "set": return cmdSet(parsed, autoApply);
    case "move": return cmdMove(parsed, autoApply);
    case "unset": return cmdUnset(parsed, autoApply);
    case "list": return cmdList();
    case "apply": return cmdApply();
    case undefined:
    case "help":
    case "--help":
    case "-h": return printHelp();
    default:
      console.error(c.red(`Comando desconhecido: ${cmd}`));
      printHelp();
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(c.red("Erro:"), err);
  process.exit(1);
});
