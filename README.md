# 🌐 Watcher & Crawler de Airsoft (Arsenal Sports)
> **Automated web scraping and product changes notification system.**

Language / Idioma:
[🇺🇸 English](#-english-version) | [🇧🇷 Versão em Português](#-versao-em-portugues)

---

## 🇺🇸 English Version

An automated, resilient web crawler designed to monitor multiple product categories from "Arsenal Sports". The script crawls paginated listings, parses key product details, tracks inventory/price changes against snapshots, and pushes real-time notifications via webhooks.

### ✨ Key Features
- **Multi-Category Watcher**: Crawls 12 different product categories (from replicas to internal parts).
- **Anti-Scraping Bypass**: Employs realistic headers (User-Agent, Accept-Language) and custom category-level delays to avoid request blocking.
- **Change Detection**: Stores data in `snapshot.json` to compare previous runs, logging new arrivals, price modifications, or sold-out items.
- **Discord/Telegram Webhook Alerts**: Pushes clean notifications instantly when changes occur.

### 🛠️ Technologies
- **Node.js** (v18+ with native `fetch` support)
- **Cheerio** (Resilient DOM parsing & scraping)
- **Filesystem Node API** (`node:fs/promises`)

### 🚀 Getting Started

#### Prerequisites
- Node.js installed locally.

#### Installation & Setup
1. Clone or copy the folder:
   ```bash
   cd crawler
   npm install cheerio
   ```
2. Configure your Discord or Telegram Webhook environment variable (Optional):
   ```bash
   # Linux/macOS
   export WEBHOOK_URL="https://discord.com/api/webhooks/your-id"
   
   # Windows (PowerShell)
   $env:WEBHOOK_URL="https://discord.com/api/webhooks/your-id"
   ```
3. Run the script:
   ```bash
   node crawler.js
   ```

### 📁 Project Structure
```
crawler/
├── crawler.js        # Core crawler logic and webhook integration
├── package.json      # Dependencies and script settings
├── snapshot.json     # Local database of products for diff checks
└── .gitignore        # Git ignore configurations
```

---

## 🇧🇷 Versão em Português

Um crawler e monitor automatizado projetado para mapear categorias de produtos no site "Arsenal Sports". Ele analisa listagens paginadas, extrai informações cruciais (nomes, preços, imagens), detecta mudanças e envia alertas instantâneos via webhook.

### ✨ Funcionalidades
- **Monitoramento Multi-Categoria**: Rastreia 12 categorias distintas (réplicas, upgrades, magazines, BBs, etc).
- **Bypass de Anti-Scraping**: Utiliza User-Agents e delays configuráveis entre requisições para evitar bloqueios de IP.
- **Detecção de Mudanças**: Armazena o estado atual em `snapshot.json` para realizar checagens incrementais (novidades, alterações de preço e itens esgotados).
- **Notificação Instantânea**: Dispara alertas detalhados via Discord/Telegram Webhook.

### 🛠️ Tecnologias
- **Node.js** (v18+ com suporte nativo a `fetch`)
- **Cheerio** (Parsing rápido de DOM HTML)
- **API Filesystem do Node** (`node:fs/promises`)

### 🚀 Começando

#### Pré-requisitos
- Node.js instalado.

#### Instalação
1. Acesse o diretório e instale as dependências:
   ```bash
   cd crawler
   npm install cheerio
   ```
2. Configure a variável de ambiente para notificações (Opcional):
   ```bash
   # Windows (PowerShell)
   $env:WEBHOOK_URL="https://discord.com/api/webhooks/sua-url"
   ```
3. Execute o monitoramento:
   ```bash
   node crawler.js
   ```

### 📁 Estrutura
```
crawler/
├── crawler.js        # Lógica principal do scraper e integrações
├── package.json      # Dependências (cheerio)
├── snapshot.json     # Banco de dados local para checagem incremental
└── .gitignore        # Configurações do Git
```
