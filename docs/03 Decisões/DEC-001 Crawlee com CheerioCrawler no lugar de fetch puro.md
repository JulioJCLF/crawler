---
tipo: decisao
id: DEC-001
status: aceita
data: 2026-09-20
decisores:
  - Luiz
tags:
  - crawler/decisao
---
# DEC-001 — Crawlee com CheerioCrawler no lugar de fetch puro

> [!info] Registro retroativo
> Esta decisão já estava valendo no código. Foi escrita em 2026-09-20 para ficar rastreável. Confira se o motivo descrito bate com o que você lembra.

## Contexto
Precisávamos de fila de requisições, concorrência controlada e novas tentativas automáticas. Fazer isso na mão em cima de `fetch` daria mais código e menos previsibilidade.

## Decisão
Usar Crawlee (`CheerioCrawler`) para orquestrar as requisições e Cheerio para ler o HTML, em TypeScript rodando com `tsx`.

## Consequências
- Concorrência entre 2 e 10, até 3 tentativas e 30 segundos de limite por requisição.
- Dependência maior no backend, em troca de menos código próprio de fila e retry.
- Trocar de motor de scraping exige nova decisão.

## Evidências
`backend/src/crawler.ts`, `docs/03-crawler-spec.md`

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-20 | Registrada a partir do que já estava implementado | Luiz | — |
