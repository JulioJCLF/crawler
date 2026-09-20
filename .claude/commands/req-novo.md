---
description: Cria um requisito novo a partir de uma descrição em linguagem solta
argument-hint: descrição do que precisa existir
---
Crie um requisito novo para: $ARGUMENTS

Antes de escrever:
- Leia `AGENTS.md` e `docs/02 Requisitos/Como Escrever Requisitos.md`.
- Confira o maior número existente em `docs/02 Requisitos` e use o próximo.
- Verifique se já não existe requisito cobrindo isso. Se existir, diga qual e pare.

Ao escrever:
- Use `docs/90 Templates/Template - Requisito.md`.
- Um comportamento por requisito. Se tiver dois, crie dois.
- `status: rascunho`, `area` entre backend, frontend, automacao e dados, `sprint` conforme `projeto.json`.
- Critérios de aceite no formato Dado / quando / então — cada um deve virar teste.
- O que você não souber vira Dúvidas em aberto. Não invente regra.

No fim, mostre o arquivo criado e pergunte se aprovo antes de mudar o status.
