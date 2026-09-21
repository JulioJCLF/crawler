---
tipo: requisito
id: REQ-008
titulo: Avisar as mudanças por webhook
autora: Luiz
data: 2026-09-20
status: aprovado
categoria: funcional
area: backend
prioridade: must
sprint: 2
escopo: mvp
implementado_em:
usa_ia: false
relacionados: []
tags:
  - crawler/requisito
---
# Avisar as mudanças por webhook

> [!warning] Divergência entre documentação e código encontrada em 2026-09-20
> Este requisito foi escrito como se já estivesse implementado, mas revisão de código (PM-002) não encontrou nenhum envio de webhook em `backend/src` — nenhuma chamada de rede, nenhuma referência a Discord/Telegram. O workflow `.github/workflows/watch.yml` recebe a secret `WEBHOOK_URL` mas ela não é usada em lugar nenhum. Ou seja: **hoje, mudanças de preço, restock e produtos novos não geram nenhum aviso.**
>
> Luiz decidiu em 2026-09-20 deixar o webhook **desativado por enquanto** — fica pra outra hora. Status voltou para `aprovado` (requisito válido, sem trabalho ativo agora). REQ-018 e REQ-019 foram ajustados para não depender deste webhook.

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
- [ ] **Dado** 40 mudanças numa execução, **quando** a notificação for enviada, **então** ela chega em partes, sem cortar produto no meio.
- [ ] **Dado** nenhuma mudança, **quando** a execução terminar, **então** nenhuma mensagem é enviada.

## Dúvidas em aberto
- [x] Conferir se o comportamento descrito bate com o código atual. — Não bate: não há envio de webhook implementado.
- [ ] Qual serviço de webhook usar — Discord ou Telegram (DEC-003 permite os dois, mas não decide qual)? Precisa saber pra montar o formato da mensagem e o limite de caracteres por parte.
- [ ] A secret `WEBHOOK_URL` já configurada no GitHub Actions aponta pra qual serviço?
- [ ] Quando retomar este requisito — sem data definida por enquanto.

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-20 | Status corrigido de `implementado` para `aprovado` (pausado a pedido de Luiz) — código de envio de webhook não existe, apesar da secret `WEBHOOK_URL` estar configurada no workflow. Retomar depois | Luiz | [[PM-002 Aumentar a confiabilidade do sistema]] |
| 2026-09-20 | Requisito escrito a partir do sistema em funcionamento | Luiz | [[DEC-007 Adoção do sistema de documentação e trilhos para agentes]] |
