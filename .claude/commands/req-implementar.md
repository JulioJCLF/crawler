---
description: Implementa um requisito aprovado, do código ao registro
argument-hint: REQ-NNN
---
Implemente o requisito $ARGUMENTS.

Regras:
1. Leia `AGENTS.md`, o arquivo do requisito e a especificação técnica relacionada em `docs/01-architecture.md`, `docs/02-data-model.md`, `docs/03-crawler-spec.md` ou `docs/05-frontend-guidelines.md`.
2. Se o status não for `aprovado` nem `em-desenvolvimento`, **pare e me avise**.
3. Se houver ambiguidade ou dúvida em aberto relevante, **pare e pergunte**. Não invente regra de negócio.
4. Trabalhe em branch `req-NNN-descricao-curta`.
5. Cada critério de aceite vira ao menos um teste no Vitest.
6. Mudou regra de extração, limites de requisição ou formato do snapshot? Atualize a especificação técnica na mesma sessão.
7. Rode os testes do backend antes de concluir.
8. Termine com `/sessao-fim`.

Nunca altere concorrência, retries ou timeout do crawler sem uma decisão nova em `docs/03 Decisões`.
