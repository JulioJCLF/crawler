# Arsenal Crawler — instruções para agentes de IA

> Padrão aberto AGENTS.md: vale para Claude, Gemini, ChatGPT/Codex, Cursor e qualquer outro agente. `CLAUDE.md` e `GEMINI.md` só importam este arquivo. **Esta é a única cópia das regras.**

## O que é o projeto
Um robô que acompanha o catálogo da Arsenal Sports, detecta novidades, mudanças de preço e reposições, avisa por webhook e alimenta uma vitrine estática. Explicação completa em `docs/01 Produto/Sobre o Arsenal Crawler.md`.

## Onde está cada coisa
| Pasta | Conteúdo |
|---|---|
| `backend/` | Crawler em TypeScript (Crawlee + Cheerio) |
| `frontend/` | Vitrine em Next.js, exportada como site estático |
| `docs/01-architecture.md`, `02-data-model.md`, `03-crawler-spec.md`, `05-frontend-guidelines.md` | **Especificações técnicas** — continuam valendo, índice em `docs/06 Construção/Especificações Técnicas.md` |
| `docs/00 Comece Aqui.md` | Guia de entrada |
| `docs/01 Produto/` | O que o projeto é, para quem e o que está fora |
| `docs/02 Requisitos/` | `REQ-NNN *.md` — o que o sistema faz |
| `docs/03 Decisões/` | `DEC-NNN *.md` — escolhas técnicas e o porquê |
| `docs/04 Pedidos de Mudança/` | `PM-NNN *.md` |
| `docs/05 Registro/` | Registro de Mudanças e `Sessões/` |
| `docs/Painéis/` | **Gerados** por `scripts/gerar-paineis.py` — nunca editar à mão |
| `.github/workflows/` | CI, publicação da vitrine e execução diária |

## Stack (DEC-001 a DEC-005)
TypeScript + tsx · Crawlee (CheerioCrawler) + Cheerio · estado em `backend/snapshot.json` versionado · notificação por webhook · Next.js com export estático no GitHub Pages · GitHub Actions como agendador · Vitest.

## Regras invioláveis
1. **Spec-driven:** comportamento novo começa pela documentação. Primeiro o requisito e a especificação, depois o código.
2. **Respeito ao site de origem:** concorrência, retries e timeouts do `03-crawler-spec.md` não aumentam sem decisão registrada. Nada de derrubar o alvo.
3. **O snapshot é histórico:** `snapshot.json` não é apagado nem regravado sem preservar o histórico de preços dos produtos.
4. **A vitrine tem fim comercial:** nenhum refactor pode remover preço, botão de WhatsApp ou carrinho do card (ver `05-frontend-guidelines.md`).
5. **Filtros anti-poluição não somem:** a lista de palavras que descarta item fora de escopo é regra de negócio.
6. **Sem informação suficiente, diga que falta.** Nunca invente preço, marca ou categoria.

## Vocabulário controlado
- `status` dos requisitos: `rascunho`, `em-revisao`, `aprovado`, `em-desenvolvimento`, `implementado`, `descartado`.
- `status` das decisões: `proposta`, `aceita`, `substituida`, `rejeitada`.
- `status` dos pedidos: `recebido`, `em-analise`, `aprovado`, `aplicado`, `recusado`.
- `area`: `backend`, `frontend`, `automacao`, `dados`.

## Regras de trabalho (trilhos)
- **Só implemente o que está em um REQ `aprovado` ou `em-desenvolvimento`.** Ideia nova vira Pedido de Mudança.
- REQ ambíguo: **pare e pergunte**.
- Mudança de stack, de agendamento ou de regra de scraping exige `DEC-NNN` nova.
- Um requisito por branch (`req-NNN-descricao`); cada critério de aceite vira ao menos um teste no Vitest.
- Mexeu em regra de extração? Atualize `docs/03-crawler-spec.md` junto.

## Comandos
| Comando | O que faz |
|---|---|
| `make docs` | Regenera os painéis em `docs/Painéis` |
| `make test` | Testes do backend (Vitest) |
| `make typecheck` | Checagem de tipos de backend e frontend |
| `make crawler` | Roda o crawler uma vez, localmente |
| `make frontend-dev` | Sobe a vitrine em desenvolvimento |
| `make portal-build` | Compila o portal da documentação |

Atalhos do Claude Code em `.claude/commands`: `/req-novo`, `/req-implementar`, `/pedido`, `/docs-check` e `/sessao-fim`.

## Protocolo de documentação (toda sessão)
**Ao começar:** leia este arquivo, as últimas linhas de `docs/05 Registro/Registro de Mudanças.md` e os REQs envolvidos.

**Ao terminar, antes do commit:**
1. Atualize `status` e a tabela "Histórico" do REQ trabalhado.
2. Crie a nota em `docs/05 Registro/Sessões/AAAA-MM-DD - <quem> - <assunto>.md`.
3. Acrescente a linha no topo do `Registro de Mudanças`.
4. Rode `python3 scripts/gerar-paineis.py`.
5. Commit citando o requisito: `feat(req-NNN): ...`.

## Estilo
Português simples, frases curtas. Explique o que muda para quem usa o sistema, não como o código foi escrito.
