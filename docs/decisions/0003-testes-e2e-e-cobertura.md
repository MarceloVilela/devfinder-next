# 0003 — Sem teste e2e e sem limiar de cobertura (por ora)

## Status

Aceito (v5, Etapa 3, 2026-10-31). Reabrir se o app ganhar fluxo próprio com regra de negócio que
só se verifique de ponta a ponta.

## Contexto

A suíte (Jest + Testing Library) cobre hooks, store, `fetchJSON`/`fetchListing`/`fetchDetail`,
`error.tsx`, os Client Components de lista (`Trend`, `UserAll`, `Subs`, `UserLiked`,
`UserDisliked`, `ChannelCategories`), os botões otimistas e o gate de `/video/refresh`. Não há
e2e (o workspace tem um projeto `dev-playwright` à parte) nem relatório/limiar de cobertura.

## Decisão

Não adicionar Playwright neste repositório nem um limiar de cobertura nesta rodada.

- **Os fluxos que só um e2e verificaria dependem de terceiro.** O login é OAuth do GitHub contra o
  backend de referência (Render, plano gratuito, sem SLA — `docs/limitacoes-conhecidas.md`). Um
  e2e que o exercite herda o cold start de 30-60s e a indisponibilidade desse serviço, e
  deixaria o CI refém dele (mesmo motivo que manteve o `pnpm build` do CI contra porta fechada).
- **O controle de acesso que só era testado à mão agora tem teste de unidade**
  (`app/video/refresh/__tests__/page.test.tsx`: token certo, errado, ausente e variável não
  configurada).
- **O que o e2e acrescentaria sobre o estado atual é pequeno** para um app de listagens públicas
  e detalhes: renderização e navegação, já cobertas por `next build` no CI e por testes de
  componente.
- **Limiar de cobertura sem baseline vira número arbitrário** e incentiva teste para encher
  porcentagem. A lacuna que importava (servidor e rotas sem teste) foi fechada por item, não por
  meta global.

## Limitações assumidas

- A dedup de `generateMetadata` + página via `cache()` do React (`lib/fetchDetail.ts`) **não** é
  testável sob Jest: `cache()` só memoiza em Server Component e é passa-direto em jsdom
  (verificado). A garantia é o comentário no arquivo e a checagem manual de 1 request ao backend
  por carregamento do detalhe.
- Os `page.tsx` de listagem e detalhe (Server Components assíncronos) não têm teste próprio; o
  comportamento de dados é coberto pelos helpers que usam e a renderização por `next build`.
- UI do `error.tsx` e dos esqueletos não é verificada em navegador por teste automatizado.
