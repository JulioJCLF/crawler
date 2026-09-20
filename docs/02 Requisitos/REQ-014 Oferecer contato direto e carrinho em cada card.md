---
tipo: requisito
id: REQ-014
titulo: Oferecer contato direto e carrinho em cada card
autora: Luiz
data: 2026-09-20
status: implementado
categoria: funcional
area: frontend
prioridade: must
sprint: 4
escopo: mvp
implementado_em: 2026-09-20
usa_ia: false
relacionados: []
tags:
  - crawler/requisito
---
# Oferecer contato direto e carrinho em cada card

> [!info] Escrito a partir do que já existe
> Este requisito descreve comportamento que já está implementado. Foi escrito em 2026-09-20 para dar rastreabilidade ao que o sistema faz. Confira se corresponde ao seu entendimento antes de usá-lo como base para mudanças.

## Problema / Contexto
A vitrine tem fim comercial. Sem caminho de contato, ela vira catálogo morto.

## Comportamento esperado
1. Cada card tem botão de WhatsApp com nome, referência e preço já preenchidos.
2. Cada card tem botão de adicionar ao carrinho para montar um pedido.

## Regras de negócio
- RN1: nenhum refactor de tema ou layout pode remover esses botões.

## Critérios de aceite
- [x] **Dado** um card qualquer, **quando** for renderizado, **então** ele tem preço, botão de WhatsApp e botão de carrinho.

## Dúvidas em aberto
- [ ] Conferir se o comportamento descrito bate com o código atual.

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-20 | Requisito escrito a partir do sistema em funcionamento | Luiz | [[DEC-007 Adoção do sistema de documentação e trilhos para agentes]] |
