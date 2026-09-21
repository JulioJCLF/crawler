---
tipo: decisao
id: DEC-004
status: aceita
data: 2026-09-20
decisores:
  - Luiz
tags:
  - crawler/decisao
---
# DEC-004 — Vitrine em Next.js exportada como site estático

> [!info] Registro retroativo
> Esta decisão já estava valendo no código. Foi escrita em 2026-09-20 para ficar rastreável. Confira se o motivo descrito bate com o que você lembra.

## Contexto
A vitrine lê um JSON e não precisa de servidor. Export estático elimina custo de hospedagem e simplifica o deploy.

## Decisão
Frontend em Next.js com export estático, publicado no GitHub Pages pelo workflow `static.yml`.

## Consequências
- Nada de rota de servidor ou API no frontend.
- Qualquer recurso que exija servidor exige decisão nova.

## Evidências
`frontend/next.config.ts`, `.github/workflows/static.yml`

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-20 | Registrada a partir do que já estava implementado | Luiz | — |
