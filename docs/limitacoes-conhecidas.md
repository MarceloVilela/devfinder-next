# Limitações conhecidas

## Backend de referência sem SLA

`NEXT_PUBLIC_API_URL` aponta, por padrão, para um deploy gratuito (Render) sem garantia de
disponibilidade; a instância pode ficar lenta/indisponível (cold start, sono por inatividade), o
que já gerou 504 nas listagens (`/`, `/video`, `/user`, `/channel`) na primeira carga real do
app — achado A4 (v4, Etapa 2).

Mitigado (não eliminado — é limitação de terceiro, fora de controle deste repositório): todo
`fetch` a este backend usa o mesmo timeout curto (`DEFAULT_FETCH_TIMEOUT_MS`,
`src/lib/fetchJSON.ts`) em vez de esperar o 504 cru da plataforma.

- As 4 listagens e as 3 seções de sessão (`Subs`/`UserLiked`/`UserDisliked`) degradam pra um
  fallback amigável inline (`src/components/FeedbackMessage`).
- As 3 páginas de detalhe (`/video/[slug]`, `/user/[slug]`, `/channel/[slug]`, achado do
  fechamento v4) usam o mesmo timeout mas **sem** fallback local — o erro de rede sobe pro
  `error.tsx` global (com botão "Tentar novamente"), por design: só ausência de dado vira 404
  nessas rotas, erro de rede real não deve virar "não encontrado".
