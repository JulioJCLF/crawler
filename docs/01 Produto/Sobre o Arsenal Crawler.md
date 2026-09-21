---
tipo: produto
tags:
  - crawler/produto
---
# Sobre o Arsenal Crawler

## O que é
Um robô que visita o catálogo da Arsenal Sports todos os dias, anota o que encontrou e compara com o dia anterior. Quando algo muda — produto novo, preço diferente, item que voltou ao estoque ou que passou a ser "sob consulta" — ele avisa por mensagem automática. Os mesmos dados alimentam uma vitrine na web.

## Para quem
Para quem acompanha o mercado de airsoft e precisa saber de mudança de preço e reposição antes dos outros, sem abrir o site várias vezes por dia.

## O que ele faz hoje
- Acompanha 14 categorias, página por página, até acabar a listagem.
- Descarta itens fora do assunto (fitness, caneca, adesivo e afins).
- Guarda tudo em um arquivo de snapshot e mantém o histórico de preço de cada produto.
- Avisa por webhook quando algo muda, quebrando a mensagem em partes quando fica longa.
- Publica uma vitrine estática com busca, filtros por marca e categoria, preço em reais, botão de WhatsApp e carrinho.

## O que está fora
- Comprar, reservar ou alterar qualquer coisa no site de origem.
- Monitorar outras lojas além da Arsenal Sports.
- Banco de dados: o estado vive num arquivo versionado.

## Como saber que está funcionando
- A execução diária termina sem erro e grava o snapshot.
- Mudança real no site aparece como notificação no mesmo dia.
- A vitrine publicada reflete o último snapshot.
