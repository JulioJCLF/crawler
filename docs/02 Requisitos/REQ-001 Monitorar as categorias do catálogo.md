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

> [!warning] Divergência corrigida em 2026-09-21 (docs-check)
> A RN2 original dizia que produto duplicado fica com a categoria do "primeiro encontro". Conferido contra `backend/src/crawler.ts` e `config.ts`: isso nunca foi assim — existe um sistema de pesos (`enforceCategory`/`CATEGORY_WEIGHTS`) que decide, independente de ordem de descoberta. RN2 corrigida abaixo.

## Problema / Contexto
O robô precisa saber onde olhar. As categorias e suas URLs ficam em `backend/src/config.ts`.

## Comportamento esperado
1. O sistema lê a lista de categorias configurada.
2. Para cada categoria, começa pela primeira página da listagem.
3. Cada produto encontrado recebe o slug e o nome da categoria de origem.
4. Se o mesmo produto aparecer em mais de uma categoria, a categoria final é decidida por peso (RN2), não por ordem de descoberta.

## Regras de negócio
- RN1: a lista de categorias é configuração, não vem do site.
- RN2: produto repetido em duas categorias fica com a categoria de **maior peso** (`CATEGORY_WEIGHTS` em `config.ts`, aplicado por `enforceCategory`), não com a do primeiro encontro. Exemplos: nome que bate com regra de "arma de verdade" tem peso 100; "bucking" (borracha de hop-up) tem peso 110 e vence qualquer coisa; categorias de peça genérica ficam entre 1 e 6. Esse peso também pode redirecionar o produto para uma categoria diferente da de origem (ex.: um item raspado em "réplicas" mas que é peça vai parar em "peças internas/externas"), incluindo a categoria derivada "buckings", que não tem URL própria no site (`VIRTUAL_CATEGORIES`).

## Critérios de aceite
- [x] **Dado** a lista com 14 categorias, **quando** a execução começa, **então** existe ao menos uma requisição para cada categoria.
- [x] **Dado** um produto presente em duas categorias, **quando** o snapshot é salvo, **então** ele aparece uma vez só, com a categoria de maior peso entre as duas.

## Dúvidas em aberto
- [x] Conferir se o comportamento descrito bate com o código atual. — Não batia (RN2); corrigido em 2026-09-21.
- [ ] O sistema de pesos (`enforceCategory`/`CATEGORY_WEIGHTS`) e a categoria derivada "buckings" nunca tiveram requisito próprio — foram implementados antes do sistema de documentação existir. Vale abrir um REQ retroativo dedicado a essa heurística (fora do escopo desta correção pontual).

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-21 | RN2 corrigida: categoria de produto duplicado é decidida por peso (`enforceCategory`), não por ordem de descoberta. Achado no docs-check | Luiz | branch `docs-check-2026-09-21` |
| 2026-09-20 | Requisito escrito a partir do sistema em funcionamento | Luiz | [[DEC-007 Adoção do sistema de documentação e trilhos para agentes]] |
