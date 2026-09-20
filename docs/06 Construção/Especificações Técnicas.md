---
tipo: construcao
tags:
  - crawler/construcao
---
# 🧭 Especificações técnicas

As especificações originais continuam valendo e não foram movidas. Elas são o detalhe técnico; os requisitos em `02 Requisitos` são a versão em linguagem simples do mesmo comportamento.

| Documento | Do que trata |
|---|---|
| `docs/01-architecture.md` | Arquitetura, módulos e fluxo de execução |
| `docs/02-data-model.md` | Estrutura do snapshot, Product e histórico de preço |
| `docs/03-crawler-spec.md` | Extração, limites de requisição, filtros e paginação |
| `docs/05-frontend-guidelines.md` | Regras de interface e componentes que não podem sumir |
| `docs/README.md` | Índice original da documentação spec-driven |

## Como os dois se conectam
- Comportamento novo: escreva o **requisito** primeiro, depois ajuste a especificação técnica correspondente, depois o código.
- Mudou a regra de extração? `03-crawler-spec.md` e o REQ afetado mudam na mesma sessão.
- Quando um documento destes for substituído, ele ganha aviso no topo em vez de ser apagado.
