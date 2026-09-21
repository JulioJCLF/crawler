---
tipo: guia
tags:
  - crawler/guia
---
# 🛠️ Manual do mantenedor

Quem cuida da documentação faz estas cinco coisas.

## 1. Receber um pedido de mudança
Salve o arquivo em `04 Pedidos de Mudança` como `PM-NNN Título.md`, com status `recebido`. Analise, decida com quem tem a caneta e registre a decisão no próprio pedido.

## 2. Criar ou alterar um requisito
Use o template. Ao alterar, **acrescente uma linha no Histórico** do próprio arquivo — nunca apague as anteriores.

## 3. Registrar uma decisão
Toda escolha de rumo vira `DEC-NNN`, com contexto, opções consideradas, decisão e consequências. Decisão antiga que deixou de valer não some: vira `substituida`.

## 4. Fechar a sessão de trabalho
Nota em `05 Registro/Sessões/`, linha no topo do `Registro de Mudanças`, e:
```bash
python3 scripts/gerar-paineis.py
```

## 5. Publicar
```bash
cd portal && npx quartz build -d ../docs
git add -A docs && git commit -m "docs: ..." && git push
```

## Regras que evitam bagunça
- Número nunca é reaproveitado.
- Painéis não se editam à mão.
- Status só dos valores do `AGENTS.md`.
- Documento que virou histórico ganha aviso no topo, não é apagado.
