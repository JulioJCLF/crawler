---
tipo: construcao
status: vigente
data: 2026-09-20
tags:
  - crawler/construcao
---
# 🗺️ Plano de trabalho

Onde o projeto está e o que faz sentido atacar em seguida. Atualize este arquivo quando a prioridade mudar.

## Situação
Os 16 requisitos descrevem o que já funciona. O sistema roda todo dia, notifica e publica a vitrine. A documentação passou a existir em 2026-09-20.

## Primeiro: conferir o que foi escrito
Os requisitos foram escritos a partir do código, não do seu planejamento. Enquanto não forem conferidos, eles têm uma dúvida em aberto no rodapé.

- [ ] Ler REQ-001 a REQ-016 e corrigir o que estiver diferente do que você queria.
- [ ] Apagar a dúvida em aberto de cada um que estiver conferido.
- [ ] Rodar `/docs-check` para ver se a documentação e o código discordam em algum ponto.

## Candidatos a próximos requisitos
Ideias que apareceram na leitura do código e do histórico. Nenhuma está aprovada — cada uma precisa virar requisito ou ser descartada.

| Ideia | Por que | Área |
|---|---|---|
| Alertar quando uma execução falhar | Hoje uma falha do crawler passa em silêncio até alguém olhar o Actions | automacao |
| Monitorar tamanho do snapshot | O arquivo só cresce; em algum momento vira problema de repositório | dados |
| Filtro por faixa de preço na vitrine | Filtro de marca e categoria existe, o de preço não | frontend |
| Marcar quedas de preço relevantes | Separar queda de centavos de queda que interessa | dados |
| Teste que trava se o HTML do site mudar | O crawler quebra em silêncio quando o site muda de layout | backend |

## Como trabalhar
1. `/req-novo <ideia>` para transformar a ideia em requisito.
2. Aprovar o requisito (status `aprovado`).
3. `/req-implementar REQ-NNN`.
4. `/sessao-fim` antes do commit.
