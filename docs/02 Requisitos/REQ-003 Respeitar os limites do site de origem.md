---
tipo: requisito
id: REQ-003
titulo: Respeitar os limites do site de origem
autora: Luiz
data: 2026-09-20
status: implementado
categoria: funcional
area: backend
prioridade: must
sprint: 1
escopo: mvp
implementado_em: 2026-09-20
usa_ia: false
relacionados: []
tags:
  - crawler/requisito
---
# Respeitar os limites do site de origem

> [!info] Escrito a partir do que já existe
> Este requisito descreve comportamento que já está implementado. Foi escrito em 2026-09-20 para dar rastreabilidade ao que o sistema faz. Confira se corresponde ao seu entendimento antes de usá-lo como base para mudanças.

## Problema / Contexto
O alvo é um site de terceiros. Exagerar em requisições prejudica o site e derruba nosso acesso.

## Comportamento esperado
1. O sistema trabalha com concorrência entre 2 e 10 requisições.
2. Repete uma requisição que falhou até 3 vezes.
3. Desiste de uma requisição após 30 segundos.

## Regras de negócio
- RN1: aumentar qualquer um desses números exige decisão registrada.
- RN2: o sistema se identifica com cabeçalhos realistas, sem fingir ser outra coisa.

## Critérios de aceite
- [x] **Dado** uma requisição que falha por timeout, **quando** ainda houver tentativa, **então** o sistema tenta de novo.
- [x] **Dado** a terceira falha seguida, **quando** ocorrer, **então** o sistema segue para a próxima requisição sem derrubar a execução.

## Dúvidas em aberto
- [ ] Conferir se o comportamento descrito bate com o código atual.

## Histórico
| Data | O que mudou | Quem | Referência |
|---|---|---|---|
| 2026-09-20 | Requisito escrito a partir do sistema em funcionamento | Luiz | [[DEC-007 Adoção do sistema de documentação e trilhos para agentes]] |
