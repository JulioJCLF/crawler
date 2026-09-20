---
tipo: requisito
id: REQ-008
titulo: Avisar as mudanças por webhook
autora: Luiz
data: 2026-09-20
status: implementado
categoria: funcional
area: backend
prioridade: must
sprint: 2
escopo: mvp
implementado_em: 2026-09-20
usa_ia: false
relacionados: []
tags:
  - crawler/requisito
---
# Avisar as mudanças por webhook

> [!info] Escrito a partir do que já existe
> Este requisito descreve comportamento que já está implementado. Foi escrito em 2026-09-20 para dar rastreabilidade ao que o sistema faz. Confira se corresponde ao seu entendimento antes de usá-lo como base para mudanças.

## Problema / Contexto
O aviso precisa chegar sem a pessoa abrir o sistema.

## Comportamento esperado
1. Terminada a comparação, o sistema monta a mensagem com as mudanças.
2. Envia para a URL de webhook configurada.
3. Divide a mensagem em partes quando passa do limite do destino.

## Regras de negócio
- RN1: sem mudanças, não envia mensagem.
- RN2: sem webhook configurado, a execução continua normalmente e apenas registra no log.

## Critérios de aceite
- [x] **Dado** 40 mudanças numa execução, **quando** a notificação for enviada, **então** ela chega em partes, sem cortar produto no meio.
- [x] **Dado** nenhuma mudança, **quando** a execução terminar, **então** nenhuma mensagem é enviada.

## Dúvidas em aberto
- [ ] Conferir se o comportamento descrito bate com o código atual.

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-20 | Requisito escrito a partir do sistema em funcionamento | Luiz | [[DEC-007 Adoção do sistema de documentação e trilhos para agentes]] |
