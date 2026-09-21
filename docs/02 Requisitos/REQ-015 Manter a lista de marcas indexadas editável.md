---
tipo: requisito
id: REQ-015
titulo: Manter a lista de marcas indexadas editável
autora: Luiz
data: 2026-09-20
status: implementado
categoria: funcional
area: dados
prioridade: should
sprint: 4
escopo: mvp
implementado_em: 2026-09-20
usa_ia: false
relacionados: []
tags:
  - crawler/requisito
---
# Manter a lista de marcas indexadas editável

> [!info] Escrito a partir do que já existe
> Este requisito descreve comportamento que já está implementado. Foi escrito em 2026-09-20 para dar rastreabilidade ao que o sistema faz. Confira se corresponde ao seu entendimento antes de usá-lo como base para mudanças.

## Problema / Contexto
Marca nova entra no mercado toda hora e a filtragem depende dessa lista.

## Comportamento esperado
1. A lista de marcas fica num arquivo simples de editar.
2. O crawler e a vitrine usam a mesma lista.

## Regras de negócio
- RN1: acrescentar marca não exige mexer em código de extração.

## Critérios de aceite
- [x] **Dado** uma marca nova adicionada à lista, **quando** a próxima execução rodar, **então** produtos dessa marca são reconhecidos.

## Dúvidas em aberto
- [ ] Conferir se o comportamento descrito bate com o código atual.

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-20 | Requisito escrito a partir do sistema em funcionamento | Luiz | [[DEC-007 Adoção do sistema de documentação e trilhos para agentes]] |
