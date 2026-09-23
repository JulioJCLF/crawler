---
tipo: sessao
data: "2026-09-23"
responsavel: claude
objetivo: Trocar o número de WhatsApp usado nos pedidos da vitrine
reqs:
  - REQ-014
pedidos: []
decisoes: []
commits: []
tags:
  - crawler/sessao
---
# Novo número de WhatsApp da vitrine

## Resumo em linguagem simples
Os pedidos pela vitrine agora vão para o WhatsApp **+55 45 99985-8096**. Antes, a vitrine usava um número provisório (`5541999999999`). Também foi corrigido um detalhe: o carrinho tinha esse número escrito direto no código, separado da configuração. Agora o botão do card e o carrinho usam o mesmo número configurado, e trocar o número no futuro exige mudar um lugar só.

## O que foi feito
- Número trocado na configuração da vitrine.
- Carrinho passou a ler o número da configuração, em vez de ter um número próprio fixo.
- `backend/config.json` já estava com o número novo; nada mudou lá.

## Arquivos alterados
- `frontend/src/config/site.ts`
- `frontend/src/components/layout/FloatingCart.tsx`

## Critérios de aceite cobertos
- Não se aplica — mudança de configuração. O card continua com preço, botão de WhatsApp e carrinho (REQ-014 e regra 4 do AGENTS.md).

## Pendências e dúvidas
- Nenhuma.
