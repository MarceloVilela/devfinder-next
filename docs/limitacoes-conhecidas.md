# Limitações conhecidas

## Backend de referência sem SLA

`NEXT_PUBLIC_API_URL` aponta, por padrão, para um deploy gratuito (Render) sem garantia de
disponibilidade; a instância pode ficar lenta/indisponível (cold start, sono por inatividade), o
que já gerou 504 nas listagens (`/`, `/video`, `/user`, `/channel`) na primeira carga real do
app — achado A4 (v4, Etapa 2).

Mitigado (não eliminado — é limitação de terceiro, fora de controle deste repositório): todo
`fetch` a este backend usa o mesmo timeout curto (`DEFAULT_FETCH_TIMEOUT_MS`,
`src/lib/fetchJSON.ts`) em vez de esperar o 504 cru da plataforma.

- As 3 seções de sessão (`Subs`/`UserLiked`/`UserDisliked`) degradam pra um fallback amigável
  inline (`src/components/FeedbackMessage`) — sem cache de ISR pra proteger (`cache: 'no-store'`,
  cada request é dinâmico de qualquer forma), então capturar e mostrar localmente não tem o
  efeito colateral do item abaixo.
- As 4 listagens públicas (`/`, `/video`, `/user`, `/channel`) e as 3 páginas de detalhe
  (`/video/[slug]`, `/user/[slug]`, `/channel/[slug]`) **não** capturam erro de rede localmente —
  ele sobe pro `error.tsx` global (com botão "Tentar novamente"). Nas listagens isso é
  intencional desde `review-human.md` #1: um catch que devolve fallback local, sob ISR
  (`revalidate`), faz o Next cachear esse fallback como se fosse a página boa, substituindo a
  última versão válida até a próxima revalidação — deixar a exceção subir preserva o
  comportamento nativo do Next de manter servindo a última versão boa em cache enquanto uma
  revalidação falha. Nas páginas de detalhe o motivo é outro (por design, desde o fechamento v4):
  só ausência de dado vira 404, erro de rede real não deve virar "não encontrado".
