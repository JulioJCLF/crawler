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

> [!warning] Divergência corrigida em 2026-09-21 (docs-check)
> O texto original dizia que "o crawler e a vitrine usam a mesma lista" de marcas. Conferido: `AIRSOFT_BRANDS` só existe em `frontend/src/lib/brands.ts` — o backend/crawler não tem nenhuma noção de marca. O reconhecimento de marca é 100% da vitrine, feito ao vivo no navegador (não depende de rodar o crawler de novo).

## Problema / Contexto
Marca nova entra no mercado toda hora e a filtragem por marca na vitrine depende dessa lista.

## Comportamento esperado
1. A lista de marcas fica num arquivo simples de editar (`frontend/src/lib/brands.ts`).
2. A vitrine usa essa lista para reconhecer a marca a partir do nome do produto e montar o filtro de marca.
3. O crawler não usa essa lista — ele não categoriza por marca, só por tipo de item (ver `docs/03-crawler-spec.md`).

## Regras de negócio
- RN1: acrescentar marca não exige mexer em código de extração nem esperar a próxima execução do crawler — o reconhecimento é feito na vitrine, a partir do snapshot já existente.

## Critérios de aceite
- [x] **Dado** uma marca nova adicionada à lista, **quando** a vitrine carregar de novo, **então** produtos dessa marca (já presentes no snapshot) são reconhecidos no filtro, sem precisar rodar o crawler.

## Dúvidas em aberto
- [x] Conferir se o comportamento descrito bate com o código atual. — Não batia ("crawler e vitrine usam a mesma lista"); corrigido em 2026-09-21.

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-21 | Corrigido: reconhecimento de marca é só da vitrine (frontend), o crawler não usa essa lista. Achado no docs-check | Luiz | branch `docs-check-2026-09-21` |
| 2026-09-20 | Requisito escrito a partir do sistema em funcionamento | Luiz | [[DEC-007 Adoção do sistema de documentação e trilhos para agentes]] |
