---
tipo: pedido-mudanca
id: PM-001
titulo: Melhorar o design da vitrine
pedido_por: Luiz
data: "2026-09-20"
status: aprovado
urgencia: normal
afeta: ["[[REQ-011 Listar produtos com filtros e paginação]]", "[[REQ-012 Esconder itens sob consulta da vitrine]]", "[[REQ-013 Mostrar preço em reais com o preço anterior]]", "[[REQ-014 Oferecer contato direto e carrinho em cada card]]", "[[DEC-004 Vitrine em Next.js exportada como site estático]]"]
decidido_por: Luiz
aplicado_em:
tags:
  - crawler/pedido
---
# Melhorar o design da vitrine

## O que precisa mudar?
O foco é usabilidade: a vitrine precisa ficar mais intuitiva, para o usuário se encontrar sozinho — achar o que procura sem esforço (navegação, busca, filtros, organização das categorias). Design visual (cores, tipografia, cards) entra como parte disso, mas a prioridade é a pessoa não se perder.

## Por quê?
A vitrine tem fim comercial (regra inviolável do AGENTS.md): ela é a cara do catálogo pra quem compra. Se o usuário não encontra o produto com facilidade, perde a venda. Mais intuitividade tende a aumentar confiança e conversão.

## Exemplo
Situação real a detalhar com quem pediu: em quais pontos hoje o usuário se perde — não acha os filtros, não sabe onde clicar, demora pra achar um produto específico, a navegação entre categorias é confusa?

---
*Preenchido por Luiz:*

## Análise
- Requisitos e decisões afetados: REQ-011 (filtros e paginação), REQ-012, REQ-013, REQ-014 (elementos do card) e DEC-004 (Next.js estático). Nenhum precisa mudar de stack — é ajuste de UX/UI dentro do que já existe.
- Impacto (prazo, esforço, risco): médio esforço, baixo risco técnico. Vai virar um ou mais REQs de frontend, um por branch, sem tocar no crawler.
- Respeita as regras do produto (IA sugere, humano valida; ética; gates)? Sim. Rascunho do(s) REQ vai manter a regra 4 do AGENTS.md — preço, botão de WhatsApp e carrinho continuam obrigatórios no card.

## Decisão
- Resultado: aprovado — foco em usabilidade/navegação, para o usuário se encontrar sozinho na vitrine.
- Decidido por: Luiz — data: 2026-09-20

## O que foi alterado
| Arquivo | Mudança |
|---|---|
