---
tipo: requisito
id: REQ-009
titulo: Rodar sozinho todo dia e guardar o resultado
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
# Rodar sozinho todo dia e guardar o resultado

> [!info] Escrito a partir do que já existe
> Este requisito descreve comportamento que já está implementado. Foi escrito em 2026-09-20 para dar rastreabilidade ao que o sistema faz. Confira se corresponde ao seu entendimento antes de usá-lo como base para mudanças.

## Problema / Contexto
A graça está em rodar sem ninguém mandar.

## Comportamento esperado
1. O agendador executa o crawler uma vez por dia.
2. Ao terminar, o snapshot atualizado é gravado de volta no repositório.
3. Também é possível disparar a execução manualmente.

## Regras de negócio
- RN1: duas execuções não podem rodar ao mesmo tempo.
- RN2: falha na execução não pode gravar snapshot pela metade.

## Critérios de aceite
- [x] **Dado** o horário agendado, **quando** chegar, **então** a execução começa sem intervenção.
- [x] **Dado** uma execução bem-sucedida, **quando** terminar, **então** existe um commit com o snapshot novo.

## Dúvidas em aberto
- [ ] Conferir se o comportamento descrito bate com o código atual.

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-20 | Requisito escrito a partir do sistema em funcionamento | Luiz | [[DEC-007 Adoção do sistema de documentação e trilhos para agentes]] |
