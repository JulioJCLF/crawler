---
tipo: pedido-mudanca
id: PM-
titulo:
pedido_por:
data: "{{date:YYYY-MM-DD}}"
status: recebido        # recebido | em-analise | aprovado | aplicado | recusado
urgencia: normal        # baixa | normal | alta
afeta: []               # ex.: "[[REQ-036 ...]]", "[[DEC-004 Hospedagem]]"
decidido_por:
aplicado_em:
tags:
  - crawler/pedido
---
# {{title}}

## O que precisa mudar?
(Descreva com suas palavras.)

## Por quê?
(Qual problema ou oportunidade motivou o pedido.)

## Exemplo
(Uma situação real ajuda muito.)

---
*Preenchido por Luiz:*

## Análise
- Requisitos e decisões afetados:
- Impacto (prazo, esforço, risco):
- Respeita as regras do produto (IA sugere, humano valida; ética; gates)? 

## Decisão
- Resultado: aprovado / recusado — motivo:
- Decidido por: — data:

## O que foi alterado
| Arquivo | Mudança |
|---|---|
