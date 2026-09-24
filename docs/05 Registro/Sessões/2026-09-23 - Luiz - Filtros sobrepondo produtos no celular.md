---
tipo: sessao
data: "2026-09-23"
responsavel: claude
objetivo: Corrigir os filtros da vitrine que ficavam por cima dos produtos no celular
reqs:
  - REQ-011
pedidos: []
decisoes: []
commits: []
tags:
  - crawler/sessao
---
# Filtros sobrepondo produtos no celular

## Resumo em linguagem simples
No celular, o painel de filtros ficava grudado no topo da tela, com fundo transparente, e os produtos passavam por cima dele. A vitrine ficava ilegível. Além disso, a pessoa precisava rolar a lista inteira de categorias antes de ver o primeiro produto.

Agora, no celular, os filtros ficam só no topo e rolam junto com a página. As categorias viraram uma fila que rola para o lado, e os produtos aparecem logo abaixo. No computador nada mudou: a barra lateral continua fixa à esquerda.

## O que foi feito
- O painel de filtros só fica fixo no topo a partir da largura de tablet (`md`). No celular, ele rola com a página.
- A área de produtos só tem rolagem própria no computador. No celular, a página rola inteira, sem uma rolagem dentro da outra.
- Categorias em fila horizontal no celular e lista vertical no computador.
- Logo e espaçamentos menores no celular.
- Criada a classe `scrollbar-hide`, que já era usada no layout `topbar` mas não existia.
- Conferido com prints no tamanho iPhone 13 (390px) e em 1366px de largura.

## Arquivos alterados
- `frontend/src/components/layout/Filters.tsx`
- `frontend/src/app/page.tsx`
- `frontend/src/app/globals.css`

## Critérios de aceite cobertos
- Não se aplica: é uma correção de layout. Os filtros do REQ-011 funcionam igual. O card continua com preço, botão de WhatsApp e carrinho (regra 4 do AGENTS.md).

## Pendências e dúvidas
- Não há teste automático de layout. A conferência foi visual, por prints.
