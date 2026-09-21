---
tipo: sessao
data: "2026-09-21"
responsavel: claude
objetivo: Investigar por que o CI parecia nunca disparar em Pull Request e corrigir o problema real encontrado
reqs: []
pedidos: []
decisoes: []
commits: []
tags:
  - crawler/sessao
---
# Corrigido CI quebrado no Node 18

## Resumo em linguagem simples
Na sessão anterior, parecia que o CI nunca rodava quando alguém abria uma Pull Request — investigando de novo, descobri que na verdade **ele sempre rodou**. Eu tinha olhado, por engano, uma checagem de um serviço de terceiro (Vercel) que fica travada, em vez da checagem real do GitHub Actions. O CI de verdade rodou nas duas PRs anteriores (REQ-017 e REQ-018) e **falhou nas duas**, silenciosamente, sem ninguém perceber (não há trava que impeça merge com CI vermelho). A causa: o frontend (Next.js 16) exige Node 20.9 ou mais novo, mas o CI ainda testava Node 18, que sempre quebrava com um erro de binário nativo do Tailwind/PostCSS sem nenhuma relação com o código do projeto. Corrigido trocando a versão testada.

## O que foi feito
- Identificado que a "checagem travada" da sessão anterior era do app Vercel (auto-deploy de PR), não do nosso CI — falsa pista.
- Encontrado o CI real (`github-actions`) rodando e falhando nas PRs #1 e #2, ambas já mergeadas com CI vermelho.
- Causa raiz: `next` exige `node >= 20.9.0` (`engines` em `next/package.json`), mas a matriz do CI testava `[18.x, 20.x]`. No Node 18, `npm test` do frontend falhava com "Cannot find native binding" ao carregar o PostCSS (bug conhecido de dependências opcionais nativas do Tailwind v4 em versões antigas de npm).
- Corrigida a matriz do CI para `[20.x, 22.x]` — mantém teste em mais de uma versão do Node (REQ-016), agora dentro do que o projeto realmente suporta.

## Arquivos alterados
- `.github/workflows/ci.yml`

## Critérios de aceite cobertos
- Não se aplica — correção de infraestrutura de CI, sem mudança de comportamento do sistema. Indiretamente sustenta REQ-016 (bateria de testes rodando de verdade em mais de uma versão do Node).

## Pendências e dúvidas
- Não há proteção de branch no repositório — nada impede merge com CI vermelho hoje (violação de fato da RN2 do REQ-016: "bateria vermelha não vai para o branch principal"). Vale considerar configurar branch protection exigindo o check do CI, como pedido de mudança separado.
- Os gaps de documentação (overrides, config de marca/tema, categoria "buckings" sem requisito) seguem pendentes da sessão anterior.
