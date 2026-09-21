---
tipo: requisito
id: REQ-019
titulo: Detectar queda brusca de produtos numa categoria antes de publicar
autora: Luiz
data: 2026-09-20
status: implementado
categoria: nao-funcional
area: backend
prioridade: must
sprint: 3
escopo: mvp
implementado_em: 2026-09-21
usa_ia: false
relacionados: ["[[REQ-006 Comparar com a execução anterior e classificar a mudança]]", "[[REQ-018 Avisar quando a execução diária falhar]]", "[[PM-002 Aumentar a confiabilidade do sistema]]"]
tags:
  - crawler/requisito
---
# Detectar queda brusca de produtos numa categoria antes de publicar

## Problema / Contexto
Hoje `backend/src/index.ts` só protege contra falha total: se o crawler extrair **zero** produtos no total, o snapshot não é sobrescrito. Mas cada categoria é raspada de forma independente (`backend/src/crawler.ts`), e o `failedRequestHandler` de uma categoria que falhar (ex.: o site mudou o layout só daquela categoria) apenas registra um log de erro — não impede o snapshot de ser salvo com aquela categoria vazia ou muito reduzida, enquanto as outras continuam normais. Esse tipo de falha parcial passaria despercebido e seria publicado na vitrine como se fosse real (produtos "somem" do catálogo).

## História de usuário
**Como** responsável pelo Arsenal Crawler, **quero** ser avisado quando uma categoria específica cair bruscamente de uma execução para outra, **para** identificar rapidamente se o site mudou de estrutura e o crawler parou de reconhecer aquela categoria, em vez de descobrir só quando um cliente reclamar que não acha mais o produto.

## Comportamento esperado
1. Depois de extrair os produtos atuais e antes de sobrescrever o snapshot, o sistema compara a contagem de produtos de cada categoria com a contagem da execução anterior.
2. Se alguma categoria cair de forma anormal (RN3 e RN4), o sistema grava um arquivo de alerta (`backend/category-alert.json`) listando as categorias afetadas, contagem antes e depois. O processo termina com sucesso (exit 0) — isso não é uma falha de execução.
3. O snapshot ainda é salvo normalmente (não trava a execução).
4. Um passo do workflow (`watch.yml`), executado logo depois do crawler **só quando ele terminou com sucesso** (se o crawler falhar totalmente, esse passo é pulado — REQ-018 já cobre esse caso), verifica se o arquivo de alerta existe: se existir, abre ou atualiza uma Issue rotulada `alerta-categoria` com a lista de categorias afetadas; se não existir e houver uma Issue `alerta-categoria` aberta, fecha essa Issue (categoria se recuperou).

## Papel da IA
Não se aplica.

## Regras de negócio
- RN1: a comparação é por categoria, não só pelo total geral — é isso que detecta a falha parcial que o guard atual (`atuais.length === 0`) não pega.
- RN2: o alerta usa o mesmo mecanismo de Issue automática de REQ-018 (avisos operacionais), não o webhook de REQ-008 (desativado por enquanto), mas numa Issue separada (rotulada como alerta de categoria, não como falha de execução) — a execução em si não falhou.
- RN3: uma categoria só entra na checagem de queda se tinha pelo menos 10 produtos na execução anterior. Abaixo disso, variação natural de estoque pode zerar ou reduzir a categoria sem ser sinal de falha do crawler, e o alerta viraria ruído.
- RN4: "queda brusca" é: a categoria caiu 50% ou mais em relação à execução anterior, ou zerou. Esse número fica registrado aqui — se gerar alerta demais ou de menos na prática, ajusta-se aqui e não no código.

## Dados envolvidos
- contagem de produtos por categoria da execução atual — já calculada em `categorySummary` (`index.ts`).
- contagem de produtos por categoria da execução anterior — já existe em `snapshot.categories` do snapshot salvo.
- `backend/category-alert.json` — novo arquivo temporário (não versionado), gerado só quando há alerta, lido pelo workflow e descartado a cada execução.

## Critérios de aceite
- [x] **Dado** uma categoria com 10+ produtos na execução anterior que zera na execução atual, **quando** o snapshot for processado, **então** um alerta é gerado citando a categoria. (`categoryDrop.test.ts`)
- [x] **Dado** uma categoria com 10+ produtos na execução anterior que cai 50% ou mais (mas não zera), **quando** o snapshot for processado, **então** um alerta é gerado citando a categoria. (`categoryDrop.test.ts`)
- [x] **Dado** uma categoria com menos de 10 produtos na execução anterior, **quando** ela cair ou zerar, **então** nenhum alerta é gerado (abaixo do piso da RN3). (`categoryDrop.test.ts`)
- [x] **Dado** uma categoria com queda abaixo de 50%, **quando** o snapshot for processado, **então** nenhum alerta é gerado. (`categoryDrop.test.ts`)
- [x] **Dado** a primeira execução (sem snapshot anterior), **quando** o snapshot for processado, **então** nenhum alerta de queda é gerado (não há o que comparar). (`categoryDrop.test.ts`)

## Exceções e erros
- Categoria nova (que não existia na execução anterior) não conta como queda.

## Fora de escopo
- Corrigir automaticamente o seletor/regra de extração da categoria — este requisito só alerta, não corrige sozinho.
- Pausar a publicação da vitrine quando houver alerta — REQ-010 continua publicando normalmente.

## Dúvidas em aberto
- [x] Qual é o limite que caracteriza "queda brusca"? — Decidido: RN3 e RN4 (piso de 10 produtos, queda de 50%+ ou zerar). Ajustável aqui se gerar ruído ou não pegar casos reais.
- [x] Como o alerta chega até o workflow? — Decidido: arquivo `backend/category-alert.json`, lido por um passo do workflow.
- [x] Issue separada ou junto com a de REQ-018? — Decidido: Issue separada, rótulo `alerta-categoria`.

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-21 | Implementado: `backend/src/reliability/categoryDrop.ts` (detecção, testada) + `categoryAlert.ts` (decisão de Issue, testada) + `backend/src/reportCategoryDrops.ts` (chama `gh`) + passo novo em `watch.yml`, condicionado ao crawler ter terminado com sucesso | Luiz | branch `req-019-alerta-queda-categoria` |
| 2026-09-20 | Criado a partir do PM-002 | Luiz | [[PM-002 Aumentar a confiabilidade do sistema]] |
