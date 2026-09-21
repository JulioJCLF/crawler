---
tipo: requisito
id: REQ-007
titulo: Manter o histórico de preços de cada produto
autora: Luiz
data: 2026-09-20
status: implementado
categoria: funcional
area: dados
prioridade: must
sprint: 2
escopo: mvp
implementado_em: 2026-09-20
usa_ia: false
relacionados: []
tags:
  - crawler/requisito
---
# Manter o histórico de preços de cada produto

> [!info] Escrito a partir do que já existe
> Este requisito descreve comportamento que já está implementado. Foi escrito em 2026-09-20 para dar rastreabilidade ao que o sistema faz. Confira se corresponde ao seu entendimento antes de usá-lo como base para mudanças.

## Problema / Contexto
Uma mudança isolada diz pouco. A série de preços mostra tendência e ajuda a saber se a oferta é real.

## Comportamento esperado
1. Cada mudança de preço acrescenta um ponto ao histórico do produto.
2. O histórico anterior nunca é sobrescrito.

## Regras de negócio
- RN1: o histórico só cresce; correção de dado errado é registrada, não apagada.

## Critérios de aceite
- [x] **Dado** um produto com três mudanças de preço, **quando** o snapshot é lido, **então** os três pontos estão lá com suas datas.

## Dúvidas em aberto
- [ ] Conferir se o comportamento descrito bate com o código atual.

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-20 | Requisito escrito a partir do sistema em funcionamento | Luiz | [[DEC-007 Adoção do sistema de documentação e trilhos para agentes]] |
