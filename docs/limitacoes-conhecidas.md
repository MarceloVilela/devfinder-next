# Limitações conhecidas

## Backend de referência sem SLA

`NEXT_PUBLIC_API_URL` aponta, por padrão, para um deploy gratuito (Render) sem garantia de
disponibilidade; a instância pode ficar lenta/indisponível (cold start, sono por inatividade), o
que já gerou 504 nas listagens (`/`, `/video`, `/user`, `/channel`) na primeira carga real do
app — achado A4 (v4, Etapa 2).

Mitigado (não eliminado — é limitação de terceiro, fora de controle deste repositório): todo
`fetch` a este backend usa um timeout curto (`DEFAULT_FETCH_TIMEOUT_MS`, `src/lib/fetchJSON.ts`,
5s) em vez de esperar o 504 cru da plataforma — exceto as 4 listagens (`/`, `/video`, `/user`,
`/channel`), que usam `LISTING_COLD_START_TIMEOUT_MS` (`src/lib/fetchListing.ts`, 55s): cold
start do Render free tier é reportado em ~30-60s, então 5s estourava sistematicamente nessas
rotas; acompanhado de `export const maxDuration = 60` nos respectivos `page.tsx` (sem isso a
Vercel mataria a função bem antes dos 55s no plano Hobby sem Fluid Compute). Não é garantia
contra todo cold start (o relato de "cerca de um minuto" às vezes passa dos 55s), só reduz
bastante a chance.

- As 3 seções de sessão (`Subs`/`UserLiked`/`UserDisliked`) são CSR (reversão de M1 — ver
  CLAUDE.md "Regra de renderização") e nunca chegam a rodar no servidor: um erro de rede ali é
  só um `catch` local no `useEffect`, que já degrada pra um fallback amigável inline
  (`SessionErrorFallback`) sem qualquer risco de cache — nada disso passa perto de ISR.
- As 3 páginas de detalhe (`/video/[slug]`, `/user/[slug]`, `/channel/[slug]`) **não** capturam
  erro de rede localmente — ele sobe pro `error.tsx` global (com botão "Tentar novamente"), por
  design (fechamento v4): só ausência de dado vira 404, erro de rede real não deve virar "não
  encontrado".
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
