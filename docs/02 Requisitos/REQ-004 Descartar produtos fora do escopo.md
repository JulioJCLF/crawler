---
tipo: requisito
id: REQ-004
titulo: Descartar produtos fora do escopo
autora: Luiz
data: 2026-09-20
status: implementado
categoria: funcional
area: backend
prioridade: must
sprint: 1
escopo: mvp
implementado_em: 2026-09-20
usa_ia: false
relacionados: []
tags:
  - crawler/requisito
---
# Descartar produtos fora do escopo

> [!info] Escrito a partir do que já existe
> Este requisito descreve comportamento que já está implementado. Foi escrito em 2026-09-20 para dar rastreabilidade ao que o sistema faz. Confira se corresponde ao seu entendimento antes de usá-lo como base para mudanças.

## Problema / Contexto
O site mistura itens de fitness, bem-estar e brindes no meio do airsoft.

## Comportamento esperado
1. Cada produto passa por uma checagem de validade antes de entrar na lista.
2. Produto com palavra-chave de descarte é ignorado.

## Regras de negócio
- RN1: a lista de palavras de descarte é regra de negócio e não pode ser removida em refactor.
- RN2: produto descartado não gera notificação.

## Critérios de aceite
- [x] **Dado** um produto com \"caneca\" no nome, **quando** for processado, **então** ele não entra no snapshot.

## Dúvidas em aberto
- [ ] Conferir se o comportamento descrito bate com o código atual.

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-20 | Requisito escrito a partir do sistema em funcionamento | Luiz | [[DEC-007 Adoção do sistema de documentação e trilhos para agentes]] |
