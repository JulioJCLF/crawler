---
tipo: decisao
id: DEC-003
status: aceita
data: 2026-09-20
decisores:
  - Luiz
tags:
  - crawler/decisao
---
# DEC-003 — Notificação por webhook de Discord ou Telegram

> [!info] Registro retroativo
> Esta decisão já estava valendo no código. Foi escrita em 2026-09-20 para ficar rastreável. Confira se o motivo descrito bate com o que você lembra.

## Contexto
O aviso precisa chegar onde a pessoa já está, sem construir app nem e-mail.

## Decisão
Enviar as mudanças por HTTP POST para uma URL de webhook configurada em variável de ambiente, dividindo mensagens longas em partes.

## Consequências
- Sem webhook configurado, o robô roda e não avisa ninguém.
- O limite de tamanho da mensagem do destino é responsabilidade do notificador.

## Evidências
`backend/src/notifier.ts`

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-20 | Registrada a partir do que já estava implementado | Luiz | — |
