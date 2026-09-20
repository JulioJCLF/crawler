---
tipo: requisito
id: REQ-016
titulo: Garantir testes automatizados a cada mudança
autora: Luiz
data: 2026-09-20
status: implementado
categoria: funcional
area: automacao
prioridade: must
sprint: 5
escopo: mvp
implementado_em: 2026-09-20
usa_ia: false
relacionados: []
tags:
  - crawler/requisito
---
# Garantir testes automatizados a cada mudança

> [!info] Escrito a partir do que já existe
> Este requisito descreve comportamento que já está implementado. Foi escrito em 2026-09-20 para dar rastreabilidade ao que o sistema faz. Confira se corresponde ao seu entendimento antes de usá-lo como base para mudanças.

## Problema / Contexto
O crawler depende do HTML de terceiros e quebra em silêncio. Teste é o que avisa cedo.

## Comportamento esperado
1. Cada publicação e cada proposta de mudança rodam a bateria de testes.
2. A bateria roda em mais de uma versão do Node.

## Regras de negócio
- RN1: critério de aceite novo vira teste novo.
- RN2: bateria vermelha não vai para o branch principal.

## Critérios de aceite
- [x] **Dado** uma proposta de mudança, **quando** o fluxo de CI rodar, **então** os testes executam e o resultado aparece na proposta.

## Dúvidas em aberto
- [ ] Conferir se o comportamento descrito bate com o código atual.

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-20 | Requisito escrito a partir do sistema em funcionamento | Luiz | [[DEC-007 Adoção do sistema de documentação e trilhos para agentes]] |
