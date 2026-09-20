---
tipo: requisito
id: REQ-011
titulo: Listar produtos com filtros e paginação
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
# Listar produtos com filtros e paginação

> [!info] Escrito a partir do que já existe
> Este requisito descreve comportamento que já está implementado. Foi escrito em 2026-09-20 para dar rastreabilidade ao que o sistema faz. Confira se corresponde ao seu entendimento antes de usá-lo como base para mudanças.

## Problema / Contexto
São milhares de itens. Sem filtro e paginação a vitrine não serve.

## Comportamento esperado
1. A vitrine mostra os produtos em páginas.
2. A pessoa filtra por categoria e por marca.
3. A lista de marcas disponíveis é montada a partir do que existe em estoque.

## Regras de negócio
- RN1: filtro que não tem resultado aparece vazio, com aviso, e não some da tela.

## Critérios de aceite
- [x] **Dado** uma marca sem produto em estoque, **quando** a lista de marcas for montada, **então** essa marca não aparece como opção.
- [x] **Dado** um filtro aplicado, **quando** a pessoa muda de página, **então** o filtro continua valendo.

## Dúvidas em aberto
- [ ] Conferir se o comportamento descrito bate com o código atual.

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-20 | Requisito escrito a partir do sistema em funcionamento | Luiz | [[DEC-007 Adoção do sistema de documentação e trilhos para agentes]] |
