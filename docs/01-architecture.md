# 01 - Arquitetura do Sistema

O **Arsenal Crawler** é uma ferramenta baseada em Node.js desenvolvida para extrair, rastrear e notificar mudanças em produtos no site da Arsenal Sports.

## Stack Tecnológica

- **Linguagem**: TypeScript (via `tsx` no ambiente de desenvolvimento/execução).
- **Core do Scraper**: [Crawlee](https://crawlee.dev/) (usando especificamente a implementação `CheerioCrawler`).
- **Parsing de DOM**: [Cheerio](https://cheerio.js.org/).
- **Armazenamento de Estado**: Sistema de arquivos local (`fs/promises`), salvando um `snapshot.json`.
- **Testes**: Vitest (configurado no `package.json`).

## Estrutura de Diretórios e Módulos (`/src`)

> [!warning] Corrigido em 2026-09-21 (docs-check)
> Esta seção descrevia um módulo `notifier.ts` e uma chamada `notifyChanges` em `index.ts` que **não existem no código**. O webhook de notificação (REQ-008) nunca chegou a ser implementado — está com status `aprovado` (pausado), não `implementado`. A lista abaixo foi corrigida para refletir os módulos reais.

A aplicação é dividida em módulos com responsabilidades únicas, orquestrados pelo ponto de entrada principal.

- **`index.ts` (Orquestrador Principal)**:
  - Inicializa o Crawler (`runCrawler`).
  - Carrega o snapshot anterior (`loadSnapshot`).
  - Calcula a diferença e rastreamento de mudanças (`applyChangeTracking`).
  - Reaplica correções manuais de categoria (`applyOverrides`, ver `overrides.ts`).
  - Salva o novo snapshot.
  - **Não envia nenhuma notificação** — esse passo (REQ-008) está pausado, não implementado.

- **`config.ts` (Configurações e Parâmetros)**:
  - Define as `CATEGORIES` monitoradas e URLs de origem, e as `VIRTUAL_CATEGORIES` (categorias derivadas, sem URL própria — ex.: `buckings`).
  - Constantes como `MAX_PAGES` e parâmetros da URL.
  - Lógica de filtro (exclusões de `wellness`, `fitness`, etc, em `isValidProduct`).
  - Sistema de pesos de categorização (`CATEGORY_WEIGHTS`, `enforceCategory`) — decide a categoria final de um produto por conteúdo do nome, podendo sobrepor a categoria de origem (ver `docs/03-crawler-spec.md`).

- **`crawler.ts` (Motor de Scraping)**:
  - Configura o `CheerioCrawler` (concorrência, timeouts).
  - Trata o DOM de cada página processando os elementos `a[href*="/produto/"]`.
  - Lidando com paginação dinamicamente.

- **`history.ts` (Gerenciador de Estado)**:
  - Lê/Escreve `snapshot.json`.
  - Processa o *diffing*: identifica se o produto é novo, mudou preço, voltou ao estoque ou perdeu o preço.
  - Atualiza o histórico de preços temporal do produto.

- **`overrides.ts` / `overrides-cli.ts` (Correções Manuais de Categoria)**:
  - `overrides.json` guarda correções pontuais de categoria por ID de produto, aplicadas depois da heurística automática.
  - `overrides-cli.ts` é uma ferramenta de linha de comando para gerenciar essas correções em lote.
  - Sem requisito próprio ainda — comportamento implementado antes do sistema de documentação existir.

- **`reliability/failureAlert.ts` + `reportExecutionStatus.ts` (REQ-018)**:
  - Decide se a execução diária deve abrir, atualizar ou fechar uma Issue de alerta no GitHub, e chama o `gh` CLI a partir dessa decisão. Não depende do webhook.

- **`types.ts`**:
  - Definições estáticas (tipagens do TypeScript) das interfaces usadas em todo o projeto.
