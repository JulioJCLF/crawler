# Portal de documentação (Quartz)

Transforma a pasta `docs/` num site com busca, links e grafo. Grátis, publicado no Cloudflare Pages e fechado por login com código no e-mail.

## 1. Instalar o Quartz nesta pasta
```bash
cd portal
git clone --depth 1 https://github.com/jackyzha0/quartz.git .
npm i
```
Depois copie o `quartz.config.yaml` do modelo por cima do que veio do clone (ele já tem as ignore patterns e o idioma ajustados) e troque `Arsenal Crawler` e `crawler` se ainda estiverem lá.

## 2. Ver localmente
```bash
python3 scripts/gerar-paineis.py
cd portal && npx quartz build --serve -d ../docs
```

## 3. Publicar no Cloudflare Pages
- Workers e Pages → Create → Pages → conectar o repositório.
- **Root directory:** `portal`
- **Build command:** `git fetch --unshallow; npm ci && npx quartz plugin install --from-config && npx quartz build -d ../docs`
- **Output directory:** `public`
- **Variável de ambiente:** `NODE_VERSION = 22`

Cada push no branch de produção republica o site sozinho.

## 4. Fechar o acesso
Cloudflare One (Zero Trust) → Access → Applications → Self-hosted:
- domínios: `<slug>-docs.pages.dev` **e** `*.<slug>-docs.pages.dev` (os dois, senão as prévias ficam abertas);
- método de login: código enviado por e-mail;
- política: lista de e-mails autorizados.

O plano gratuito cobre até 50 pessoas, mas a ativação pede um cartão.

## Cuidados
- `docs/Painéis` é gerado: rode o script antes de cada build.
- O que estiver em `ignorePatterns` não vai para o site (templates, anexos, canvas).
