# Limitações conhecidas

## Backend de referência sem SLA

`NEXT_PUBLIC_API_URL` aponta, por padrão, para um deploy gratuito (Render) sem garantia de
disponibilidade; a instância pode ficar lenta/indisponível (cold start, sono por inatividade), o
que já gerou 504 nas listagens (`/`, `/video`, `/user`, `/channel`) na primeira carga real do
app — achado A4 (v4, Etapa 2).

Mitigado (não eliminado — é limitação de terceiro, fora de controle deste repositório): todo
`fetch` a este backend usa um timeout em vez de esperar o 504 cru da plataforma: as 4 listagens
(`/`, `/video`, `/user`, `/channel`) **e as 3 páginas de detalhe** usam `COLD_START_TIMEOUT_MS`
(`src/lib/fetchJSON.ts`, 55s) — cold start do Render free tier é reportado em ~30-60s, então os
5s de `DEFAULT_FETCH_TIMEOUT_MS` estouravam sistematicamente nessas rotas; acompanhado de
`export const maxDuration = 60` nos respectivos `page.tsx` (sem isso a Vercel mataria a função
bem antes dos 55s no plano Hobby sem Fluid Compute). `DEFAULT_FETCH_TIMEOUT_MS` (5s) ficou só
como default de `fetchListing`. O feed de vídeos do canal roda depois de `getChannel` (que já
acordou o backend) e usa `min(5s, orçamento restante)` dentro de 58s, pra que as duas chamadas em
sequência não passem dos 60s de `maxDuration`. Não é garantia
contra todo cold start (o relato de "cerca de um minuto" às vezes passa dos 55s), só reduz
bastante a chance.

- As 3 seções de sessão (`Subs`/`UserLiked`/`UserDisliked`) são CSR (reversão de M1 — ver
  CLAUDE.md "Regra de renderização") e nunca chegam a rodar no servidor: um erro de rede ali é
  só um `catch` local no `useEffect`, que já degrada pra um fallback amigável inline
  (`SessionErrorFallback`) sem qualquer risco de cache — nada disso passa perto de ISR.
- As 3 páginas de detalhe (`/video/[slug]`, `/user/[slug]`, `/channel/[slug]`) **não** capturam
  erro de rede localmente — ele sobe pro `error.tsx` global (com botão "Tentar novamente"), por
  design (fechamento v4): só ausência de dado vira 404, erro de rede real não deve virar "não
  encontrado". Decisão v5 (M1): em vez de aceitar o erro durante o cold start, o detalhe usa o
  timeout de cold start (acima) e tem `loading.tsx` por segmento (`DetailSkeleton`), como o achado
  M1 pedia (sinal 4: feedback de carregamento em vez de tela parada). Trade-offs aceitos: (1) com
  `loading.tsx` o servidor começa a transmitir antes do dado chegar, então um slug inexistente
  responde **HTTP 200** com a UI de "não encontrado" e `<meta name="robots" content="noindex">`
  (comportamento documentado do Next com streaming) em vez de status 404; medido em `next dev`
  com e sem `loading.tsx`. Erro de rede continua distinto de dado ausente (o primeiro vai pro
  `error.tsx`, o segundo pra UI de não encontrado); (2) com o backend de fato fora do ar (não só dormindo), o
  visitante espera até o timeout (55s) antes de ver o `error.tsx`; recusa de conexão imediata
  (porta fechada) cai no erro na hora.
- As 4 listagens capturam erro de rede localmente com fallback amigável
  (`LISTING_UNAVAILABLE_MESSAGE`), decisão consciente pós-produção: logo após um deploy (cache de
  dado zerado) coincidindo com o backend dormindo, deixar a exceção subir sem esse catch jogava
  qualquer visitante direto pro `error.tsx` global — visto em produção em 2026-09-22. O catch fica
  no call site de cada `page.tsx` (não dentro de `fetchListing`, que continua relançando por
  padrão — ver comentário em `src/lib/fetchListing.ts`), então essas 4 rotas aceitam o risco
  original de cache poisoning que motivou `fetchListing` a relançar por padrão (`review-human.md`
  #1 — uma falha transitória durante revalidação em background também vira fallback cacheado por
  até 8h) só nesse ponto de entrada — trade-off preferido ao invés de deixar a listagem pública
  quebrada visivelmente logo após qualquer deploy.
