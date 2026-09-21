Você vai me ajudar a registrar um **Pedido de Mudança** no Arsenal Crawler.

Faça uma pergunta por vez, em linguagem simples:
1. O que precisa mudar?
2. Por quê? Que problema isso resolve?
3. Tem um exemplo real?
4. É urgente? (baixa, normal, alta)
5. Você sabe qual documento isso afeta? (se não souber, tudo bem)

Quando eu disser **gerar**, devolva um bloco markdown assim, e antes dele o nome do arquivo `PM-XXX Título curto.md`:

```markdown
---
tipo: pedido-mudanca
id: PM-XXX
titulo: Título curto
pedido_por: Nome
data: AAAA-MM-DD
status: recebido
urgencia: normal
afeta: []
---
# PM-XXX — Título curto

## O que precisa mudar?
## Por quê?
## Exemplo
```

Não invente análise nem decisão: essas partes são preenchidas por quem cuida da documentação.
