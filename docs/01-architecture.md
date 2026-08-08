# 01 - Arquitetura do Sistema

O **Arsenal Crawler** é uma ferramenta baseada em Node.js desenvolvida para extrair, rastrear e notificar mudanças em produtos no site da Arsenal Sports.

## Stack Tecnológica

- **Linguagem**: TypeScript (via `tsx` no ambiente de desenvolvimento/execução).
- **Core do Scraper**: [Crawlee](https://crawlee.dev/) (usando especificamente a implementação `CheerioCrawler`).
- **Parsing de DOM**: [Cheerio](https://cheerio.js.org/).
- **Armazenamento de Estado**: Sistema de arquivos local (`fs/promises`), salvando um `snapshot.json`.
- **Testes**: Vitest (configurado no `package.json`).

## Estrutura de Diretórios e Módulos (`/src`)

A aplicação é dividida em módulos com responsabilidades únicas, orquestrados pelo ponto de entrada principal.

- **`index.ts` (Orquestrador Principal)**:
  - Inicializa o Crawler (`runCrawler`).
  - Carrega o snapshot anterior (`loadSnapshot`).
  - Calcula a diferença e rastreamento de mudanças (`applyChangeTracking`).
  - Notifica webhook (`notifyChanges`) se existirem mudanças (`changeType` setado).
  - Salva o novo snapshot.

- **`config.ts` (Configurações e Parâmetros)**:
  - Define as `CATEGORIES` monitoradas e URLs de origem.
  - Constantes como `MAX_PAGES` e parâmetros da URL.
  - Lógica de filtro (exclusões de `wellness`, `fitness`, etc).

- **`crawler.ts` (Motor de Scraping)**:
  - Configura o `CheerioCrawler` (concorrência, timeouts).
  - Trata o DOM de cada página processando os elementos `a[href*="/produto/"]`.
  - Lidando com paginação dinamicamente.

- **`history.ts` (Gerenciador de Estado)**:
  - Lê/Escreve `snapshot.json`.
  - Processa o *diffing*: identifica se o produto é novo, mudou preço, voltou ao estoque ou perdeu o preço.
  - Atualiza o histórico de preços temporal do produto.

- **`notifier.ts` (Sistema de Alertas)**:
  - Comunica via protocolo HTTP POST simples para a URL do webhook (Discord/Telegram).
  - Realiza o "chunking" (divisão de mensagens grandes em partes menores para evitar limites do Discord, ex: 1900 caracteres).
  - Formata a aparência final das notificações.

- **`types.ts`**:
  - Definições estáticas (tipagens do TypeScript) das interfaces usadas em todo o projeto.
