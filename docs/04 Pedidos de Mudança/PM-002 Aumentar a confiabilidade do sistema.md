---
tipo: pedido-mudanca
id: PM-002
titulo: Aumentar a confiabilidade do sistema
pedido_por: Luiz
data: "2026-09-20"
status: aprovado
urgencia: normal
afeta: ["[[REQ-003 Respeitar os limites do site de origem]]", "[[REQ-006 Comparar com a execução anterior e classificar a mudança]]", "[[REQ-007 Manter o histórico de preços de cada produto]]", "[[REQ-008 Avisar as mudanças por webhook]]", "[[REQ-009 Rodar sozinho todo dia e guardar o resultado]]", "[[REQ-010 Publicar a vitrine automaticamente]]", "[[REQ-016 Garantir testes automatizados a cada mudança]]", "[[DEC-002 Estado em arquivo de snapshot versionado, sem banco]]", "[[DEC-003 Notificação por webhook de Discord ou Telegram]]", "[[DEC-005 GitHub Actions como agendador]]"]
decidido_por: Luiz
aplicado_em:
tags:
  - crawler/pedido
---
# Aumentar a confiabilidade do sistema

## O que precisa mudar?
Caráter preventivo: deixar o crawler e a automação (execução diária, snapshot, webhook, publicação da vitrine) blindados contra falha, mesmo sem incidente confirmado até agora. Isso inclui tratar erros que hoje podem não estar cobertos (páginas fora do ar, mudança de estrutura do site alvo, timeout, falha de rede) sem quebrar a execução inteira, e garantir que uma falha parcial não corrompa o snapshot nem pare a publicação.

## Por quê?
O sistema roda sozinho todo dia sem supervisão direta (REQ-009). Como ninguém acompanha em tempo real, uma falha silenciosa só apareceria quando o catálogo já estivesse desatualizado. O pedido é preventivo: reduzir a chance de "dar pau" antes que aconteça, não corrigir um incidente já ocorrido.

## Exemplo
Situação real a detalhar com quem pediu: cenários que preocupam mais — o site da Arsenal mudar de layout e o crawler quebrar sem avisar, o GitHub Actions falhar e ninguém notar, o snapshot ficar inconsistente por uma execução interrompida no meio?

---
*Preenchido por Luiz:*

## Análise
- Requisitos e decisões afetados: REQ-003 (limites do site), REQ-006 a REQ-010 (comparação, histórico, webhook, execução diária, publicação) e REQ-016 (testes). DEC-002, DEC-003 e DEC-005 continuam valendo — a mudança é tornar a execução mais resiliente dentro da stack já decidida, sem trocar de banco, webhook ou agendador.
- Impacto (prazo, esforço, risco): esforço médio/alto, espalhado em vários REQs de backend/automação — provavelmente mais de um REQ pequeno (ex.: tratamento de erro por página, alerta de falha de execução, validação de snapshot antes de sobrescrever). Risco baixo se cada mudança for testada isoladamente (REQ-016).
- Respeita as regras do produto (IA sugere, humano valida; ética; gates)? Sim. Reforça a regra 2 (respeito ao site de origem — não aumentar concorrência/retries sem DEC nova) e a regra 3 (snapshot é histórico, não pode ser sobrescrito sem preservar dado).

## Decisão
- Resultado: aprovado — caráter preventivo, sem trocar a stack (DEC-001 a DEC-005 continuam valendo).
- Decidido por: Luiz — data: 2026-09-20

## O que foi alterado
| Arquivo | Mudança |
|---|---|
