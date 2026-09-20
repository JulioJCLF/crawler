#!/usr/bin/env python3
"""Gera as páginas de acompanhamento em docs/Painéis a partir das propriedades das notas.
Configuração em projeto.json (raiz do projeto). Só usa a biblioteca padrão do Python.
Rode: python3 scripts/gerar-paineis.py — nunca edite docs/Painéis à mão."""
import re, json, datetime
from pathlib import Path
from collections import Counter, defaultdict

RAIZ = Path(__file__).resolve().parent.parent
CFG = json.loads((RAIZ / "projeto.json").read_text(encoding="utf-8"))
DOCS = RAIZ / "docs"
OUT = DOCS / "Painéis"
SLUG = CFG["slug"]
TIPO = CFG.get("tipo_item", "requisito")          # valor de `tipo:` nas notas de item
NOME_ITEM = CFG.get("nome_item", "Requisito")
NOME_ITENS = CFG.get("nome_itens", "Requisitos")
PASTA_ITENS = CFG.get("pasta_itens", "02 Requisitos")
PREFIXO = CFG.get("prefixo_item", "REQ")
FASES = CFG.get("fases", [])
CAMPO_FASE = CFG.get("campo_fase", "sprint")
CATEGORIAS = CFG.get("categorias", {})
CAMPO_CATEGORIA = CFG.get("campo_categoria", "etapa")

ICON = {"rascunho": "📝", "em-revisao": "👀", "aprovado": "✅", "em-desenvolvimento": "🔨",
        "implementado": "🚀", "descartado": "🗑️", "proposta": "💭", "aceita": "✅",
        "substituida": "↪️", "rejeitada": "❌", "recebido": "📨", "em-analise": "🔎",
        "aplicado": "🚀", "recusado": "❌", "vigente": "✅", "historico": "📦"}
ORDEM = ["rascunho", "em-revisao", "aprovado", "em-desenvolvimento", "implementado", "descartado"]

def props(path):
    txt = path.read_text(encoding="utf-8")
    m = re.match(r"---\n(.*?)\n---", txt, re.S)
    d, key = {}, None
    if not m:
        return d
    for line in m.group(1).splitlines():
        item = re.match(r"\s+-\s+(.*)", line)
        if item and key:
            d.setdefault(key, [])
            if isinstance(d[key], list):
                d[key].append(item.group(1).strip().strip('"'))
            continue
        kv = re.match(r"([\w_]+):\s*(.*)", line)
        if kv:
            key, val = kv.group(1), kv.group(2).split("  #")[0].strip().strip('"')
            d[key] = [] if val in ("", "[]") else val
    return d

def s(v):
    return v if isinstance(v, str) else ""

def st(v):
    v = s(v)
    return f"{ICON.get(v, '•')} {v}" if v else "—"

def link(p):
    return f"[[{p.stem}]]"

def barra(feitos, total, n=10):
    cheio = round(n * feitos / total) if total else 0
    return "🟩" * cheio + "⬜" * (n - cheio)

def cab(titulo, desc):
    hoje = datetime.date.today().isoformat()
    return (f"---\ntipo: painel\ngerado_em: {hoje}\ntags:\n  - {SLUG}/painel\n---\n# {titulo}\n\n"
            f"> [!info] Página gerada automaticamente em {hoje}. {desc}\n\n")

def main():
    OUT.mkdir(exist_ok=True)
    itens = sorted((DOCS / PASTA_ITENS).glob(f"{PREFIXO}-*.md"))
    decs = sorted((DOCS / "03 Decisões").glob("DEC-*.md"))
    pms = sorted((DOCS / "04 Pedidos de Mudança").glob("PM-*.md"))
    sess = sorted((DOCS / "05 Registro" / "Sessões").glob("*.md"), reverse=True)
    R = [(p, props(p)) for p in itens]

    # Itens por fase
    out = cab(f"{NOME_ITENS} por fase", "Situação de cada item, organizado pelos blocos de trabalho.")
    por_fase = defaultdict(list)
    for p, d in R:
        por_fase[s(d.get(CAMPO_FASE))].append((p, d))
    for k in sorted(por_fase, key=lambda x: int(x) if x.isdigit() else 99):
        grupo = por_fase[k]
        nome = FASES[int(k)] if k.isdigit() and int(k) < len(FASES) else "Sem fase definida"
        feitos = sum(1 for _, d in grupo if s(d.get("status")) == "implementado")
        out += f"## {k or '—'} · {nome}\n{barra(feitos, len(grupo))} {feitos}/{len(grupo)}\n\n"
        out += f"| {NOME_ITEM} | Status | Prioridade |\n|---|---|---|\n"
        for p, d in grupo:
            out += f"| {link(p)} | {st(d.get('status'))} | {s(d.get('prioridade')) or '—'} |\n"
        out += "\n"
    (OUT / f"{NOME_ITENS} por fase.md").write_text(out, encoding="utf-8")

    # Itens por categoria (opcional)
    if CATEGORIAS:
        out = cab(f"{NOME_ITENS} por categoria", "Mesma lista, organizada pela categoria de cada item.")
        por_cat = defaultdict(list)
        for p, d in R:
            por_cat[s(d.get(CAMPO_CATEGORIA))].append((p, d))
        for k, rotulo in CATEGORIAS.items():
            grupo = por_cat.get(k, [])
            if not grupo:
                continue
            out += f"## {rotulo}\n\n| {NOME_ITEM} | Status |\n|---|---|\n"
            for p, d in grupo:
                out += f"| {link(p)} | {st(d.get('status'))} |\n"
            out += "\n"
        (OUT / f"{NOME_ITENS} por categoria.md").write_text(out, encoding="utf-8")

    # Decisões
    out = cab("Decisões", "Escolhas registradas e por quê.")
    out += "| Decisão | Status | Data |\n|---|---|---|\n"
    for p in decs:
        d = props(p)
        out += f"| {link(p)} | {st(d.get('status'))} | {s(d.get('data'))} |\n"
    (OUT / "Decisões.md").write_text(out or "Nenhuma decisão ainda.\n", encoding="utf-8")

    # Pedidos
    out = cab("Pedidos de Mudança", "Pedidos da equipe e em que pé estão. Como pedir: [[Como Pedir uma Mudança]].")
    if pms:
        out += "| Pedido | Status | Pedido por | Data | Urgência |\n|---|---|---|---|---|\n"
        for p in reversed(pms):
            d = props(p)
            out += f"| {link(p)} | {st(d.get('status'))} | {s(d.get('pedido_por'))} | {s(d.get('data'))} | {s(d.get('urgencia'))} |\n"
    else:
        out += "Nenhum pedido registrado ainda.\n"
    (OUT / "Pedidos de Mudança.md").write_text(out, encoding="utf-8")

    # Visão geral
    c = Counter(s(d.get("status")) for _, d in R)
    total = len(R)
    feitos = c.get("implementado", 0)
    out = cab("Visão Geral do Projeto", f"Resumo do andamento. Detalhes: [[{NOME_ITENS} por fase]].")
    out += f"## Progresso\n{barra(feitos, total, 20)} **{feitos} de {total}** itens concluídos\n\n"
    out += f"## {NOME_ITENS} por status\n| Status | Quantidade |\n|---|---|\n"
    for k in ORDEM:
        out += f"| {st(k)} | {c.get(k, 0)} |\n"
    abertos = [p for p in pms if s(props(p).get("status")) in ("recebido", "em-analise")]
    out += f"\n## 📨 Pedidos de mudança em aberto: {len(abertos)}\n" + ("".join(f"- {link(p)}\n" for p in abertos) or "Nenhum.\n")
    out += "\n## 🕒 Últimas sessões de trabalho\n" + ("".join(f"- {link(p)}\n" for p in sess[:5]) or "Nenhuma ainda.\n")
    out += "\nLinha do tempo completa: [[Registro de Mudanças]]\n"
    (OUT / "Visão Geral do Projeto.md").write_text(out, encoding="utf-8")
    print(f"Painéis gerados em {OUT} ({total} itens, {len(decs)} decisões, {len(pms)} pedidos).")

if __name__ == "__main__":
    main()
