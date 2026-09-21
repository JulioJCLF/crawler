---
description: Fecha a sessão de trabalho seguindo o protocolo do AGENTS.md
---
Feche a sessão de trabalho atual. Siga exatamente esta ordem:

1. Liste o que foi alterado nesta sessão (`git status` e `git diff --stat`).
2. Para cada REQ trabalhado: atualize `status`, preencha `implementado_em` quando concluído e **acrescente uma linha na tabela Histórico** do próprio arquivo. Nunca apague linhas.
3. Crie `docs/05 Registro/Sessões/AAAA-MM-DD - <quem> - <assunto>.md` a partir de `docs/90 Templates/Template - Sessão de Trabalho.md`. Escreva em linguagem simples: o que mudou para quem usa o sistema, não como o código ficou.
4. Acrescente uma linha no **topo** da tabela de `docs/05 Registro/Registro de Mudanças.md`.
5. Rode `python3 scripts/gerar-paineis.py`.
6. Proponha a mensagem de commit no formato `feat(req-NNN): ...` ou `docs: ...` e **espere minha confirmação** antes de commitar.

Se algo mudou no comportamento de extração, atualize também `docs/03-crawler-spec.md`.
