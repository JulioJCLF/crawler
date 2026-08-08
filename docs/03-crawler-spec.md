# 03 - Especificação do Crawler

Este documento mapeia como os dados são minerados da origem e tratamentos realizados durante a extração, geridos pelos arquivos `crawler.ts` e `config.ts`.

## Motor e Estratégia
Utilizamos o **Crawlee (`CheerioCrawler`)** no lugar do puro Axios/Fetch para gerenciar melhor as filas de requisições, concorrência e eventuais retries.

- **Concorrência**: Mínimo 2, Máximo 10 requisições simultâneas. Evita DDoS no alvo, mantendo respeito pela infraestrutura do site.
- **Max Retries**: Até 3 tentativas se a requisição falhar/der timeout.
- **Timeout**: 30 segundos por requisição.

## Alvos (Categorias)
As categorias-alvo estão mapeadas no vetor `CATEGORIES` no `config.ts`. O sistema começa injetando requisições simulando acessos à página 1 de cada uma das URLs listadas.
Exemplos monitorados (ao todo 14 categorias):
- Réplicas
- Peças Externas / Internas
- Magazines, BBs, Gás / Baterias
- Miras, Speedsoft, Granadas, Vestuário

## Mecanismo de Extração (Parsing)
A lógica ocorre no hook `requestHandler` do Crawlee.
1. Busca por `a[href*="/produto/"]` (links que levam a produtos).
2. O **ID do Produto** é garantido via regex da URL: `/\/produto\/.*-(\d+)\.html/`.
3. O título é limpo de espaços extras: `\s+` reduzido para espaço único.
4. Preço é localizado via regex para captura explícita em USD: `USD\s*([\d.,]+)`.
5. URLs de produtos e de imagens sofrem padronização forçada, ganhando o prefixo absoluto (`https://www.arsenalsports.com...`) se vierem como relativas.

### Filtros Anti-Poluição (`isValidProduct`)
Foi identificado que o site mistura produtos "irrelevantes" (fitness) na seção de Airsoft.
Palavras-chave como `"wellness"`, `"fitness"`, `"yoga"`, `"chaveiro"`, `"adesivo"`, `"caneca"`, `"mouse pad"` disparam um **bypass imediato** e o item não entra na lista (`productsMap`), reduzindo uso de memória e eventuais alertas indesejados.

## Paginação
O crawler trabalha de maneira inteligente (Spidering linear progressivo). 
- Ele incrementa e injeta a próxima página (`?pagina=2`, `3`, etc) na fila do Crawler.
- A condição de parada ocorre caso os "itens encontrados na página" (`foundOnPage`) chegue a zero OU caso o limite drástico (`MAX_PAGES = 150`) seja atingido.
- Se houver produtos idênticos referenciados em múltiplas categorias, eles são deduplicados via `Map` (Key baseada no `ID`), mantendo a categoria do **primeiro encontro**.
