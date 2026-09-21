---
tipo: sessao
data: "2026-09-21"
responsavel: claude
objetivo: Rodar /docs-check e corrigir as divergências encontradas entre documentação e código
reqs: ["[[REQ-001 Monitorar as categorias do catálogo]]", "[[REQ-015 Manter a lista de marcas indexadas editável]]"]
pedidos: []
decisoes: []
commits: []
tags:
  - crawler/sessao
---
# Docs-check: documentação alinhada com o código real

## Resumo em linguagem simples
Comparei a documentação com o código de verdade e achei três explicações erradas: como o sistema decide a categoria de um produto que aparece em dois lugares, se o robô também reconhece marca (não reconhece — só a vitrine), e um módulo de notificação citado na arquitetura que nunca existiu. Nada mudou no comportamento do sistema — só a documentação, que agora descreve o que o código realmente faz.

## O que foi feito
- REQ-001 (RN2): corrigido. O texto dizia que produto duplicado em duas categorias fica com a categoria "do primeiro encontro" — na verdade existe um sistema de pesos (`enforceCategory`/`CATEGORY_WEIGHTS`) que decide por peso, não por ordem.
- `docs/03-crawler-spec.md`: mesma correção, e acrescentada uma seção nova documentando esse sistema de pesos (nunca tinha sido escrita).
- REQ-015: corrigido. Dizia que "o crawler e a vitrine usam a mesma lista de marcas" — na verdade o reconhecimento de marca é só da vitrine (`frontend/src/lib/brands.ts`); o backend não sabe o que é marca.
- `docs/01-architecture.md`: corrigido. Citava um módulo `notifier.ts` e uma chamada `notifyChanges` que não existem — o webhook (REQ-008) está pausado, não implementado. Aproveitado pra listar os módulos reais que faltavam (`overrides.ts`, `overrides-cli.ts`, `reliability/failureAlert.ts`, `reportExecutionStatus.ts`).
- Conferido e confirmado que **batem** com o código: `docs/02-data-model.md` (100%), `docs/05-frontend-guidelines.md` (ProductCard), REQ-002 a REQ-014, REQ-016 a REQ-018, e as 7 Decisões (nenhuma precisa virar `substituida`).

## Arquivos alterados
- `docs/02 Requisitos/REQ-001 Monitorar as categorias do catálogo.md`
- `docs/02 Requisitos/REQ-015 Manter a lista de marcas indexadas editável.md`
- `docs/03-crawler-spec.md`
- `docs/01-architecture.md`

## Critérios de aceite cobertos
- Não se aplica — sessão de correção de documentação, sem mudança de comportamento do sistema.

## Pendências e dúvidas
- REQ-019 (queda brusca de categoria) ainda não implementado — próximo da fila do PM-002.
- Gap encontrado e ainda não resolvido: `overrides.ts`/`overrides-cli.ts` (correção manual de categoria), `frontend/src/config/site.ts` + `Logo.tsx` (config de marca/tema) e a categoria derivada "buckings" não têm nenhum requisito por trás — implementados antes do sistema de documentação existir. Recomendo abrir REQs retroativos, no mesmo padrão do REQ-001 a REQ-016.
- Pendência carregada da sessão anterior, ainda não investigada: por que o CI nunca dispara em Pull Request neste repositório.
