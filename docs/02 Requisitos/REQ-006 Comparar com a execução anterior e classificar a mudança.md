---
tipo: requisito
id: REQ-006
titulo: Comparar com a execução anterior e classificar a mudança
autora: Luiz
data: 2026-09-20
status: implementado
categoria: funcional
area: dados
prioridade: must
sprint: 2
escopo: mvp
implementado_em: 2026-09-20
usa_ia: false
relacionados: []
tags:
  - crawler/requisito
---
# Comparar com a execução anterior e classificar a mudança

> [!info] Escrito a partir do que já existe
> Este requisito descreve comportamento que já está implementado. Foi escrito em 2026-09-20 para dar rastreabilidade ao que o sistema faz. Confira se corresponde ao seu entendimento antes de usá-lo como base para mudanças.

## Problema / Contexto
É a razão de existir do projeto: saber o que mudou desde ontem.

## Comportamento esperado
1. O sistema carrega o snapshot anterior.
2. Compara produto a produto pelo identificador.
3. Classifica cada mudança como novo, mudança de preço, volta ao estoque ou passou a sob consulta.
4. Grava a data da mudança no produto.

## Regras de negócio
- RN1: produto sem preço é tratado como sob consulta, não como preço zero.
- RN2: ausência de snapshot anterior significa primeira execução, e não que tudo é novidade a ser notificada em massa.

## Critérios de aceite
- [x] **Dado** um produto que estava a 100 e passou a 120, **quando** a execução terminar, **então** ele fica marcado como mudança de preço com o valor anterior guardado.
- [x] **Dado** um produto que era sob consulta e voltou com preço, **quando** a execução terminar, **então** ele fica marcado como volta ao estoque.

## Dúvidas em aberto
- [ ] Conferir se o comportamento descrito bate com o código atual.

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-20 | Requisito escrito a partir do sistema em funcionamento | Luiz | [[DEC-007 Adoção do sistema de documentação e trilhos para agentes]] |
