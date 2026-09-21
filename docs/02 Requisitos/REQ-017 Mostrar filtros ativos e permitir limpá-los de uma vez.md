---
tipo: requisito
id: REQ-017
titulo: Mostrar filtros ativos e permitir limpá-los de uma vez
autora: Luiz
data: 2026-09-20
status: implementado
categoria: ux
area: frontend
prioridade: should
sprint: 4
escopo: mvp
implementado_em: 2026-09-20
usa_ia: false
relacionados: ["[[REQ-011 Listar produtos com filtros e paginação]]", "[[PM-001 Melhorar o design da vitrine]]"]
tags:
  - crawler/requisito
---
# Mostrar filtros ativos e permitir limpá-los de uma vez

## Problema / Contexto
A vitrine tem busca, ordenação, categoria e sub-filtros (marca, peso da munição, tipo de vestuário) que se combinam. Hoje, depois de aplicar vários filtros, a pessoa não vê um resumo do que está ativo e precisa desfazer filtro por filtro (às vezes trocando de categoria) para voltar a ver o catálogo inteiro. Isso é um dos jeitos mais comuns de alguém "se perder" na vitrine, motivação do PM-001.

## História de usuário
**Como** visitante da vitrine, **quero** ver quais filtros estão ativos e limpar todos de uma vez, **para** não ficar preso em uma combinação de filtros sem saber como sair dela.

## Comportamento esperado
1. Sempre que algum filtro estiver ativo (busca, categoria, marca, peso ou tipo de vestuário), a vitrine mostra um resumo visível dos filtros aplicados.
2. A pessoa consegue remover um filtro específico a partir desse resumo, sem precisar abrir o controle original dele.
3. A pessoa consegue limpar todos os filtros de uma vez com uma única ação.
4. Quando nenhum filtro está ativo, o resumo não aparece.

## Papel da IA
Não se aplica.

## Regras de negócio
- RN1: limpar todos os filtros também reseta a paginação para a primeira página (mesma regra que já vale ao trocar qualquer filtro individual, REQ-011).
- RN2: limpar os filtros não altera a ordenação (`sortOrder`) — ordenação não é filtro.
- RN3: o resumo fica na área de conteúdo principal (`page.tsx`), acima da lista de produtos, igual nos dois layouts (sidebar e topbar) — evita duplicar a lógica dentro de `Filters.tsx`, que já trata sidebar e topbar como blocos separados.

## Dados envolvidos
- Nenhum dado novo. Usa o estado de filtros que já existe na vitrine (busca, categoria, marca, peso, vestuário).

## Critérios de aceite
- [x] **Dado** um ou mais filtros aplicados, **quando** a pessoa olha a tela, **então** vê um resumo com os filtros ativos. (`ActiveFilters.test.tsx`)
- [x] **Dado** um resumo de filtros visível, **quando** a pessoa remove um filtro específico no resumo, **então** só aquele filtro é desfeito e os demais continuam aplicados. (`ActiveFilters.test.tsx`)
- [x] **Dado** um ou mais filtros aplicados, **quando** a pessoa aciona "limpar filtros", **então** todos os filtros voltam ao estado inicial e a lista volta a mostrar todo o catálogo. (`ActiveFilters.test.tsx` + `CLEARED_FILTER_STATE` em `activeFilters.test.ts`)
- [x] **Dado** nenhum filtro aplicado, **quando** a pessoa olha a tela, **então** o resumo de filtros não aparece. (`ActiveFilters.test.tsx`)

## Exceções e erros
- Nenhuma identificada além do já coberto por REQ-011 (filtro sem resultado mostra aviso, não some da tela).

## Fora de escopo
- Mudar o visual dos filtros em si (cores, ícones, disposição) — isso fica para outro requisito de design visual, se vier a ser pedido.
- Salvar filtros entre sessões (localStorage, URL com query params) — não foi pedido.

## Dúvidas em aberto
- [x] Onde o resumo aparece? — Decidido: RN3 (área de conteúdo principal, acima da lista, igual nos dois layouts).
- [x] Já existe botão "limpar filtros"? — Conferido: não existe em `Filters.tsx` nem em `page.tsx`. É comportamento novo.

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-20 | Implementado: `ActiveFilters.tsx` + `lib/activeFilters.ts`, integrado em `page.tsx`. Frontend ganhou infraestrutura de teste (Vitest + Testing Library) pela primeira vez, incluída no CI | Luiz | branch `req-017-filtros-ativos` |
| 2026-09-20 | Criado a partir do PM-001 | Luiz | [[PM-001 Melhorar o design da vitrine]] |
