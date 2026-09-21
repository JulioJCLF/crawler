---
tipo: decisao
id: DEC-005
status: aceita
data: 2026-09-20
decisores:
  - Luiz
tags:
  - crawler/decisao
---
# DEC-005 — GitHub Actions como agendador

> [!info] Registro retroativo
> Esta decisão já estava valendo no código. Foi escrita em 2026-09-20 para ficar rastreável. Confira se o motivo descrito bate com o que você lembra.

## Contexto
Não existe servidor próprio e a execução é uma vez por dia. O agendador do próprio repositório resolve sem custo.

## Decisão
Rodar o crawler pelo workflow `watch.yml`, diariamente às 12:00 UTC (09:00 de Brasília), com execução manual disponível.

## Consequências
- Depende da disponibilidade do GitHub Actions e do atraso comum do cron de lá.
- O workflow escreve o snapshot de volta no repositório.

## Evidências
`.github/workflows/watch.yml`

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-20 | Registrada a partir do que já estava implementado | Luiz | — |
