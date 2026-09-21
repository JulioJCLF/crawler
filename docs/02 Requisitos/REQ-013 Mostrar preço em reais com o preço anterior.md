---
tipo: requisito
id: REQ-013
titulo: Mostrar preço em reais com o preço anterior
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
# Mostrar preço em reais com o preço anterior

> [!info] Escrito a partir do que já existe
> Este requisito descreve comportamento que já está implementado. Foi escrito em 2026-09-20 para dar rastreabilidade ao que o sistema faz. Confira se corresponde ao seu entendimento antes de usá-lo como base para mudanças.

## Problema / Contexto
O preço de origem vem em dólar e quem compra decide em real. O preço antigo mostra se a oferta é real.

## Comportamento esperado
1. O preço é convertido e exibido em reais conforme a configuração de preço.
2. Quando houve queda, o preço anterior aparece riscado.

## Regras de negócio
- RN1: a regra de conversão fica em um único lugar da configuração.
- RN2: sem preço, não invente: o card não entra na vitrine (ver REQ-012).

## Critérios de aceite
- [x] **Dado** um produto que baixou de preço, **quando** o card for exibido, **então** o valor antigo aparece riscado ao lado do novo.

## Dúvidas em aberto
- [ ] Conferir se o comportamento descrito bate com o código atual.

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-20 | Requisito escrito a partir do sistema em funcionamento | Luiz | [[DEC-007 Adoção do sistema de documentação e trilhos para agentes]] |
