# Controle manual de categorias (overrides)

O crawler categoriza os itens automaticamente (por origem + heurística em
`src/config.ts`). Quando algum item cai no lugar errado, você corrige aqui — de
forma **persistente**: a correção fica em `overrides.json`, versionada no git, e
é **reaplicada automaticamente a cada crawl**. Ou seja, nunca se perde.

## Como funciona

- `overrides.json` — mapa `id do produto → categoria correta`.
- A cada `npm start` (crawl), os overrides são aplicados **depois** da heurística
  automática e **antes** de salvar o `snapshot.json`. Logo, eles vencem.
- A CLI abaixo edita esse arquivo pra você e, por padrão, já atualiza o
  `snapshot.json` local na hora (pra você ver o efeito sem esperar um crawl).

Depois de mexer, faça **commit + push** de `overrides.json` (e do `snapshot.json`,
se quiser refletir na hora) — o deploy do site puxa o snapshot do GitHub.

## Comandos

```bash
cd backend

# 1) Ver as categorias válidas e quantos itens tem em cada
npm run overrides -- categories

# 2) Procurar itens fora do lugar (por nome ou id)
npm run overrides -- search "red dot" --cat replicas       # filtra pela categoria atual
npm run overrides -- search 31479                            # busca por id

# 3) Mover itens específicos (em lote, quantos ids quiser)
npm run overrides -- set miras 31479 19923 19924 --note "red dots marcados como réplica"

# 4) Migração em LOTE por padrão de nome
#    Sem --apply é só PRÉVIA (não grava nada):
npm run overrides -- move --from replicas --to magazines --match "magazine|mag\b"
#    Com --apply, confirma e grava:
npm run overrides -- move --from replicas --to magazines --match "magazine|mag\b" --apply

# 5) Listar / desfazer
npm run overrides -- list
npm run overrides -- unset 31479 19923

# 6) Reaplicar os overrides no snapshot.json agora (sem crawl)
npm run overrides -- apply

# 7) VARRER o catálogo inteiro por regra de nome (não por id)
#    Prévia (não grava):
npm run overrides -- sweep --match "\bbucking\b" --to buckings
#    Aplicar no snapshot.json:
npm run overrides -- sweep --match "\bbucking\b" --to buckings --apply
```

### `set`/`move` (por id) vs `sweep` (por regra)

- **`set` / `move`** gravam em `overrides.json` (por id). São para **exceções
  pontuais** — sobrevivem a qualquer crawl porque são reaplicados sempre.
- **`sweep`** aplica uma **regra de nome** direto no `snapshot.json` do catálogo
  inteiro (rápido para lotes grandes). Para a regra virar **permanente** (todo
  crawl), adicione-a em `src/config.ts` → `enforceCategory` (foi o que fizemos
  para buckings). Sem isso, o `sweep` vale só até o próximo crawl.

### Flags úteis

- `--limit <n>` — limita quantos itens `search`/`move` consideram.
- `--cat <slug>` — em `search`, filtra pela categoria atual.
- `--note "texto"` — anota o motivo do override (aparece no `list`).
- `--no-apply` — grava o override mas **não** mexe no `snapshot.json`
  (o efeito entra só no próximo crawl).

## Categorias válidas (slugs)

`replicas`, `pecas-externas`, `pecas-internas`, `pistolas`, `rifles-gas`,
`sniper`, `magazines`, `bbs`, `gas`, `baterias`, `granadas`, `speedsoft`,
`miras`, `vestuario`, `buckings`.

> `buckings` é uma categoria **derivada** (não vem de uma URL do site): a regra
> em `enforceCategory` recolhe todos os buckings do catálogo inteiro para ela.

> Editar `overrides.json` na mão também funciona — o formato é
> `{ "<id>": { "category": "<slug>", "note": "..." } }` (ou só `{ "<id>": "<slug>" }`).
