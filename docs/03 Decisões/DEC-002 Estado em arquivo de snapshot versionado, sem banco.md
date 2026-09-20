---
tipo: decisao
id: DEC-002
status: aceita
data: 2026-09-20
decisores:
  - Luiz
tags:
  - crawler/decisao
---
# DEC-002 — Estado em arquivo de snapshot versionado, sem banco

> [!info] Registro retroativo
> Esta decisão já estava valendo no código. Foi escrita em 2026-09-20 para ficar rastreável. Confira se o motivo descrito bate com o que você lembra.

## Contexto
O projeto roda uma vez por dia e compara o resultado com a execução anterior. Um banco traria custo e infraestrutura para um volume que cabe num arquivo.

## Decisão
Guardar o resultado de cada execução em `backend/snapshot.json`, versionado no próprio repositório, com o histórico de preços dentro de cada produto.

## Consequências
- O histórico fica junto do código e dá para auditar por commit.
- O arquivo cresce com o tempo; quando incomodar, vira decisão nova.
- A execução automática precisa de permissão de escrita no repositório.

## Evidências
`backend/snapshot.json`, `docs/02-data-model.md`, `.github/workflows/watch.yml`

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-20 | Registrada a partir do que já estava implementado | Luiz | — |
