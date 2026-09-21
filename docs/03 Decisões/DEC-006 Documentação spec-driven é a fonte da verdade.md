---
tipo: decisao
id: DEC-006
status: aceita
data: 2026-09-20
decisores:
  - Luiz
tags:
  - crawler/decisao
---
# DEC-006 — Documentação spec-driven é a fonte da verdade

> [!info] Registro retroativo
> Esta decisão já estava valendo no código. Foi escrita em 2026-09-20 para ficar rastreável. Confira se o motivo descrito bate com o que você lembra.

## Contexto
O projeto já nasceu com a regra de mudar a especificação antes do código, registrada em `docs/README.md`.

## Decisão
Manter a regra: comportamento novo começa pela documentação. Os requisitos em `02 Requisitos` são a camada em linguagem simples das mesmas regras.

## Consequências
- Código que contraria a especificação é bug ou pedido de mudança, não decisão nova.
- Documento substituído ganha aviso no topo em vez de ser apagado.

## Evidências
`docs/README.md`, `docs/06 Construção/Especificações Técnicas.md`

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-20 | Registrada a partir do que já estava implementado | Luiz | — |
