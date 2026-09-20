---
tipo: requisito
id: REQ-001
titulo: Monitorar as categorias do catálogo
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
# Monitorar as categorias do catálogo

> [!info] Escrito a partir do que já existe
> Este requisito descreve comportamento que já está implementado. Foi escrito em 2026-09-20 para dar rastreabilidade ao que o sistema faz. Confira se corresponde ao seu entendimento antes de usá-lo como base para mudanças.

## Problema / Contexto
O robô precisa saber onde olhar. As categorias e suas URLs ficam em `backend/src/config.ts`.

## Comportamento esperado
1. O sistema lê a lista de categorias configurada.
2. Para cada categoria, começa pela primeira página da listagem.
3. Cada produto encontrado recebe o slug e o nome da categoria de origem.

## Regras de negócio
- RN1: a lista de categorias é configuração, não vem do site.
- RN2: produto repetido em duas categorias fica com a categoria do primeiro encontro.

## Critérios de aceite
- [x] **Dado** a lista com 14 categorias, **quando** a execução começa, **então** existe ao menos uma requisição para cada categoria.
- [x] **Dado** um produto presente em duas categorias, **quando** o snapshot é salvo, **então** ele aparece uma vez só.

## Dúvidas em aberto
- [ ] Conferir se o comportamento descrito bate com o código atual.

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-20 | Requisito escrito a partir do sistema em funcionamento | Luiz | [[DEC-007 Adoção do sistema de documentação e trilhos para agentes]] |
