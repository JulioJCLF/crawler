---
tipo: requisito
id: REQ-XXX
titulo: Título curto e claro
autora:
data: "{{date:YYYY-MM-DD}}"
status: rascunho               # rascunho | em-revisao | aprovado | em-desenvolvimento | implementado | descartado
categoria: funcional            # funcional | nao-funcional | regra-de-negocio | ux | dados | seguranca
etapa: E2                       # transversal | E0.CORE | E0.SALES | E1 | E2 | E3 | E4 | E5 | E6
gate:                           # e0-core-readiness | offer-readiness | need-isolation | opportunity-gate | solution-fit | promise-alignment | commercial-configuration | proposal-readiness | proposal-internal-review | send-authorization | decision-resolution
prioridade: must                # must | should | could | wont
sprint:
escopo: mvp                     # mvp | pos-mvp
implementado_em:
usa_ia: true                    # true | false
usuarios:
  - vendedor                    # vendedor | gestor | socio | entrega | admin
relacionados: []                # ex.: "[[REQ-XXX Outro requisito]]"
tags:
  - crawler/requisito
---
# {{title}}

## Problema / Contexto
Por que isso importa, em 2 a 4 frases.

## História de usuário
**Como** <tipo de usuário>, **quero** <ação>, **para** <benefício>.

## Comportamento esperado
1. Passo a passo do que a pessoa faz e do que o sistema responde.

## Papel da IA
- **IA sugere:** …
- **Humano valida:** quem, e o que acontece ao validar, ajustar ou rejeitar.
(Se não usa IA, escreva "Não se aplica.")

## Regras de negócio
- RN1: …

## Dados envolvidos
- campo — descrição — obrigatório? — origem da informação (fato, cliente, vendedor, indicador, fonte pública, hipótese IA)

## Critérios de aceite
- [ ] **Dado** <situação>, **quando** <ação>, **então** <resultado>.
- [ ] **Dado** …, **quando** …, **então** …

## Exceções e erros
- …

## Fora de escopo
- …

## Dúvidas em aberto
- [ ] …

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| {{date:YYYY-MM-DD}} | Criado |  |  |
