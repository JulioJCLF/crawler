---
tipo: guia
tags:
  - crawler/guia
---
# 📐 Como escrever requisitos

Um requisito descreve **um comportamento** do sistema, em linguagem que qualquer pessoa da equipe entende.

## Regras
- Um comportamento por requisito. Se tem dois "e", provavelmente são dois requisitos.
- Título começa com verbo: "Registrar…", "Calcular…", "Exibir…".
- Escreva o que a pessoa faz e o que o sistema responde, não como o código funciona.
- O que você não sabe vira **Dúvidas em aberto**. Nunca invente regra.
- Critério de aceite no formato **Dado / quando / então** — é o que vira teste.

## Propriedades obrigatórias
`tipo`, `id`, `titulo`, `status`, `prioridade`, `sprint` e, quando fizer sentido, `etapa` e `gate`.

## Modelo
Use `90 Templates/Template - Requisito.md`. O arquivo se chama `REQ-NNN Título curto.md`.
