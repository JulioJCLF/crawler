---
tipo: sessao
data: "2026-09-21"
responsavel: claude
objetivo: Implementar o REQ-019, último requisito do PM-002 (confiabilidade)
reqs: ["[[REQ-019 Detectar queda brusca de produtos numa categoria antes de publicar]]"]
pedidos: ["[[PM-002 Aumentar a confiabilidade do sistema]]"]
decisoes: []
commits: []
tags:
  - crawler/sessao
---
# Alerta de queda brusca de categoria

## Resumo em linguagem simples
Antes, se o site da Arsenal mudasse de estrutura só numa categoria (por exemplo, "Miras" parasse de ser reconhecida), o crawler continuava rodando normalmente com as outras categorias, e ninguém saberia que aquela categoria específica sumiu — só a proteção contra falha total existia. Agora, o sistema compara cada categoria com o dia anterior: se uma categoria que tinha pelo menos 10 produtos cair 50% ou mais (ou zerar), ele abre sozinho uma Issue no GitHub avisando. Se voltar ao normal, a Issue fecha sozinha. Isso fecha o PM-002 (confiabilidade) — os três requisitos que ele gerou (REQ-008 pausado, REQ-018 e REQ-019 implementados) estão todos resolvidos.

## O que foi feito
- `backend/src/reliability/categoryDrop.ts`: decide se uma categoria caiu de forma anormal (piso de 10 produtos, queda de 50%+ ou zerar), testado com Vitest.
- `backend/src/reliability/categoryAlert.ts`: decide o que fazer com a Issue (criar, atualizar, fechar, nada), mesmo padrão do REQ-018, testado.
- `backend/src/reportCategoryDrops.ts`: script fino que lê o arquivo de alerta e chama o `gh` CLI.
- `backend/src/index.ts`: passa a comparar as categorias antes de salvar o snapshot e grava `category-alert.json` quando há queda (arquivo temporário, adicionado ao `.gitignore`).
- `watch.yml`: novo passo depois do crawler, que só roda se o crawler tiver terminado com sucesso (REQ-018 já cobre falha total).

## Arquivos alterados
- `backend/src/reliability/categoryDrop.ts` (novo)
- `backend/src/reliability/categoryDrop.test.ts` (novo)
- `backend/src/reliability/categoryAlert.ts` (novo)
- `backend/src/reliability/categoryAlert.test.ts` (novo)
- `backend/src/reportCategoryDrops.ts` (novo)
- `backend/src/index.ts`
- `.github/workflows/watch.yml`
- `.gitignore`
- `docs/02 Requisitos/REQ-019 Detectar queda brusca de produtos numa categoria antes de publicar.md` (implementado)

## Critérios de aceite cobertos
- [x] REQ-019 — Categoria com 10+ produtos que zera gera alerta.
- [x] REQ-019 — Categoria com 10+ produtos que cai 50%+ sem zerar gera alerta.
- [x] REQ-019 — Categoria com menos de 10 produtos não gera alerta, mesmo caindo ou zerando.
- [x] REQ-019 — Queda abaixo de 50% não gera alerta.
- [x] REQ-019 — Primeira execução (sem snapshot anterior) não gera alerta.

## Pendências e dúvidas
- PM-002 está com os três requisitos resolvidos (REQ-008 pausado por decisão do Luiz, REQ-018 e REQ-019 implementados).
- Segue pendente: `overrides.ts`, config de marca/tema e a categoria "buckings" sem requisito próprio (achado no docs-check da sessão anterior).
- Segue pendente: não há branch protection — nada impede merge com CI vermelho.
