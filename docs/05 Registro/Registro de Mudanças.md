---
tipo: registro
tags:
  - crawler/registro
---
# 📜 Registro de Mudanças

Linha do tempo de tudo o que mudou. **Mais recente no topo.** Detalhes de cada sessão em `Sessões/`.

| Data | O que mudou (em linguagem simples) | Quem | Detalhes |
|---|---|---|---|
| 2026-09-21 | CI estava quebrado nas duas últimas PRs sem ninguém notar: testava uma versão do Node (18) que o frontend não suporta mais. Corrigido para testar versões que o projeto realmente roda | Luiz | [[2026-09-21 - Luiz - Corrigido CI quebrado no Node 18]] |
| 2026-09-21 | Documentação corrigida em 3 pontos onde não batia com o código: como o sistema decide categoria de produto duplicado, se o robô reconhece marca (não reconhece, só a vitrine) e um módulo de notificação que nunca existiu. Nenhum comportamento do sistema mudou | Luiz | [[2026-09-21 - Luiz - Docs-check, documentação alinhada com o código real]] |
| 2026-09-21 | Execução diária agora avisa sozinha quando falha: abre uma Issue no GitHub, atualiza se falhar de novo, fecha quando se recupera. Corrigido também: repositório local estava 6 semanas desatualizado do GitHub (sincronizado sem perder nada) e o CI estava quebrado há 5 semanas por um bug de configuração | Luiz | [[2026-09-21 - Luiz - Alerta automático de falha da execução diária]] |
| 2026-09-20 | Vitrine agora mostra os filtros ativos e permite limpar tudo de uma vez. Descoberto e corrigido: o aviso de mudanças por webhook nunca foi implementado (fica pausado por enquanto). Aprovados dois requisitos de confiabilidade (aviso de falha e detecção de categoria quebrada) | Luiz | [[2026-09-20 - Luiz - Pedidos de design e confiabilidade, vitrine com filtros ativos]] |
| 2026-09-20 | Documentação estruturada: 16 requisitos, 7 decisões, painéis e regras para agentes | Luiz | [[2026-09-20 - Luiz - Adoção do sistema de documentação]] |
