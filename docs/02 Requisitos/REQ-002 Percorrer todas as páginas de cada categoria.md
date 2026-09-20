---
tipo: requisito
id: REQ-002
titulo: Percorrer todas as páginas de cada categoria
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
# Percorrer todas as páginas de cada categoria

> [!info] Escrito a partir do que já existe
> Este requisito descreve comportamento que já está implementado. Foi escrito em 2026-09-20 para dar rastreabilidade ao que o sistema faz. Confira se corresponde ao seu entendimento antes de usá-lo como base para mudanças.

## Problema / Contexto
A listagem é paginada e o número de páginas muda com o tempo.

## Comportamento esperado
1. O sistema pede a página seguinte enquanto encontrar produtos.
2. Para quando a página não traz nenhum produto.
3. Para também ao atingir o limite máximo de páginas configurado.

## Regras de negócio
- RN1: o limite máximo existe para evitar laço infinito, não para limitar o catálogo.

## Critérios de aceite
- [x] **Dado** uma categoria com 7 páginas, **quando** a execução termina, **então** os produtos das 7 páginas estão no snapshot.
- [x] **Dado** uma página vazia, **quando** ela é processada, **então** o sistema não pede a próxima.

## Dúvidas em aberto
- [ ] Conferir se o comportamento descrito bate com o código atual.

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-20 | Requisito escrito a partir do sistema em funcionamento | Luiz | [[DEC-007 Adoção do sistema de documentação e trilhos para agentes]] |
