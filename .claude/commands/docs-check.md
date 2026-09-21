---
description: Confere se a documentação ainda descreve o sistema que existe
---
Compare a documentação com o código e me traga um relatório curto.

Verifique:
1. Cada requisito em `docs/02 Requisitos` com status `implementado` ainda corresponde ao que o código faz.
2. `docs/03-crawler-spec.md` bate com `backend/src/config.ts` e `backend/src/crawler.ts` (categorias, limites, filtros, paginação).
3. `docs/02-data-model.md` bate com `backend/src/types.ts`.
4. `docs/05-frontend-guidelines.md` bate com `frontend/src/components/ProductCard.tsx` (preço, WhatsApp, carrinho).
5. Decisões em `docs/03 Decisões` que não valem mais deveriam estar como `substituida`.

Para cada divergência, diga qual documento e qual arquivo discordam e proponha: corrigir a documentação, corrigir o código ou abrir pedido de mudança. **Não altere nada sem eu escolher.**
