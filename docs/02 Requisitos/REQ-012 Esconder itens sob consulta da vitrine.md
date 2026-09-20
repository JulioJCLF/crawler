---
tipo: requisito
id: REQ-012
titulo: Esconder itens sob consulta da vitrine
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
# Esconder itens sob consulta da vitrine

> [!info] Escrito a partir do que já existe
> Este requisito descreve comportamento que já está implementado. Foi escrito em 2026-09-20 para dar rastreabilidade ao que o sistema faz. Confira se corresponde ao seu entendimento antes de usá-lo como base para mudanças.

## Problema / Contexto
Item sem preço polui a vitrine e frustra quem está comprando.

## Comportamento esperado
1. Produtos marcados como sob consulta não aparecem na listagem principal.

## Regras de negócio
- RN1: o produto continua no snapshot e continua gerando notificação quando voltar a ter preço.

## Critérios de aceite
- [x] **Dado** um produto sob consulta, **quando** a vitrine carregar, **então** ele não aparece na listagem principal.

## Dúvidas em aberto
- [ ] Conferir se o comportamento descrito bate com o código atual.

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-20 | Requisito escrito a partir do sistema em funcionamento | Luiz | [[DEC-007 Adoção do sistema de documentação e trilhos para agentes]] |
