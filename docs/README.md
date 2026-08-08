# Arsenal Crawler - Documentação Spec-Driven

Bem-vindo à documentação oficial do Crawler da Arsenal Sports. Este repositório utiliza o conceito de **Spec-Driven Development**. Isso significa que estas especificações (`docs/`) são a fonte da verdade para as regras de negócio. Qualquer nova funcionalidade, refatoração ou alteração no comportamento do bot deve primeiramente ser atualizada e especificada aqui.

## Índice

1. [Arquitetura do Sistema](./01-architecture.md)
   *Visão geral, tecnologias e fluxo de execução do crawler.*
2. [Modelo de Dados](./02-data-model.md)
   *Estrutura do Snapshot e das entidades (Product, PricePoint).*
3. [Especificação do Crawler](./03-crawler-spec.md)
   *Como os dados são extraídos, regras anti-scraping e categorias-alvo.*

---
> **Nota**: Ao implementar um novo recurso, comece alterando a respectiva documentação (ou criando um novo arquivo se for um módulo inédito) para descrever como o sistema deverá se comportar.
