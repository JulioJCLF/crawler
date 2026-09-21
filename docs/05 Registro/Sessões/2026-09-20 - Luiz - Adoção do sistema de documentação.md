---
tipo: sessao
data: 2026-09-20
responsavel: Luiz
tags:
  - crawler/sessao
---
# 2026-09-20 — Adoção do sistema de documentação

## O que foi feito
Trouxe para o Arsenal Crawler a mesma estrutura de documentação usada no V360: requisitos numerados, decisões registradas, pedidos de mudança, registro de sessões, painéis gerados por script e um `AGENTS.md` com as regras que qualquer IA deve seguir.

## O que mudou para quem usa
- Agora dá para abrir `docs/` no Obsidian e ver o projeto inteiro: o que ele faz, por que foi decidido assim e o que mudou ao longo do tempo.
- Pedido de mudança tem lugar próprio, em vez de virar edição direta em documento.
- As especificações técnicas continuam onde sempre estiveram.

## Decisões
- [[DEC-007 Adoção do sistema de documentação e trilhos para agentes]]
- DEC-001 a DEC-006 foram registradas retroativamente, a partir do que já estava implementado.

## Pendências
- Conferir os 16 requisitos: foram escritos a partir do código e do README, não do seu planejamento original.
- Decidir se o portal de documentação será publicado e onde.
