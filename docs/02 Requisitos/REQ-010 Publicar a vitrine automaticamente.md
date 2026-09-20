---
tipo: requisito
id: REQ-010
titulo: Publicar a vitrine automaticamente
autora: Luiz
data: 2026-09-20
status: implementado
categoria: funcional
area: automacao
prioridade: must
sprint: 3
escopo: mvp
implementado_em: 2026-09-20
usa_ia: false
relacionados: []
tags:
  - crawler/requisito
---
# Publicar a vitrine automaticamente

> [!info] Escrito a partir do que já existe
> Este requisito descreve comportamento que já está implementado. Foi escrito em 2026-09-20 para dar rastreabilidade ao que o sistema faz. Confira se corresponde ao seu entendimento antes de usá-lo como base para mudanças.

## Problema / Contexto
A vitrine precisa refletir o último snapshot sem trabalho manual.

## Comportamento esperado
1. Cada publicação no branch principal gera o site estático.
2. O site é publicado no GitHub Pages.

## Regras de negócio
- RN1: a vitrine é estática; nada de rota de servidor.

## Critérios de aceite
- [x] **Dado** um push no branch principal, **quando** o fluxo terminar, **então** a versão publicada contém o snapshot mais recente.

## Dúvidas em aberto
- [ ] Conferir se o comportamento descrito bate com o código atual.

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-20 | Requisito escrito a partir do sistema em funcionamento | Luiz | [[DEC-007 Adoção do sistema de documentação e trilhos para agentes]] |
