# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar com o código deste repositório.

## Processo (commits e PRs)

Nunca fazer `git commit` nem abrir Pull Request por conta própria — só quando o humano pedir
explicitamente naquela conversa. Preparar/mostrar o diff e sugerir a mensagem de commit é ok;
executar o commit ou criar o PR sem pedido explícito, não.

Nunca incluir trailer `Co-Authored-By: Claude ...` (ou qualquer variação) nas mensagens de
commit deste repositório — isso faz o GitHub listar "claude" como contribuidor no repo, o que
não é desejado aqui.

## Comandos

```bash
pnpm dev      # servidor de desenvolvimento em http://localhost:3000
pnpm build    # build de produção
pnpm start    # servidor de produção (requer build anterior)
pnpm lint     # ESLint CLI direto, eslint . --max-warnings=0 (sem o wrapper depreciado do next lint)
pnpm test     # Jest + Testing Library (gate do CI)
pnpm exec tsc --noEmit   # checagem de tipos (gate do CI; não há script `tsc` no package.json)
```

**Dependências:** o Dependabot está desligado de propósito (`docs/decisions/0004-dependabot-desligado.md`).
Não recriar `.github/dependabot.yml`. A segurança é coberta pelo job `audit` do CI (bloqueia
`high`/`critical`); a defasagem, por `pnpm outdated` no fechamento de cada rodada de melhorias.
Majors da stack central entram só como item planejado, nunca como bump isolado.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha os valores. Só a primeira é obrigatória: com um
`.env.local` contendo apenas `NEXT_PUBLIC_API_URL`, o app sobe e as rotas públicas respondem 200
(verificado em 2026-10-30). Variáveis `NEXT_PUBLIC_*` são embutidas no build — mudar uma exige
novo build.

| Variável | Uso | Necessidade |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | backend REST (`fetchJSON`, axios, rewrite `/backend`, login) | **obrigatória** (ex.: `http://localhost:3333/v1` ou o deploy do Render) |
| `NEXT_PUBLIC_TITLE` | título do site | recomendada: sem ela os metadados caem em `'DevFinder'`, mas o `<h1>` do logo (Header e login) fica vazio |
| `VIDEO_REFRESH_TOKEN` | gate de `/video/refresh` (`?token=`) | opcional: sem ela a rota dá 404 para todos |
| `NEXT_PUBLIC_API_AUTO`, `NEXT_PUBLIC_JSONBIN_ID_CHANNEL` | só o dashboard de `/video/refresh` (`RefreshClient`) | opcionais |
| `JSONBIN_KEY_MASTER`, `JSONBIN_ID_SUBS` | só a rota `pages/api/jsonbin` | opcionais: sem elas a rota responde 500 com mensagem explícita |

## Arquitetura

**DevFinder** é um app Next.js (**App Router**) que agrega conteúdo de tecnologia em português: vídeos do YouTube, perfis de usuários GitHub e canais.

### Estrutura de `src/`

- `app/` — rotas Next.js (App Router)
  - `layout.tsx` — layout raiz (`<html>/<body>`, fontes, metadata base)
  - `providers.tsx` — `'use client'`: Redux, hidratação de auth/tema, `ToastContainer`
  - `not-found.tsx`, `error.tsx` — páginas de erro (404/500)
  - `page.tsx`, `video/page.tsx`, `user/page.tsx`, `channel/page.tsx` — listagens, Server Component com `fetch` + ISR de 8h, sempre só da página 1 (ver "Regra de renderização" abaixo — página 2+ é CSR)
  - `user/[slug]/page.tsx`, `video/[slug]/page.tsx`, `channel/[slug]/page.tsx` — detalhe, Server Component renderizado por request (`cache: 'no-store'`, sem `generateStaticParams` — o conjunto de slugs é aberto); usam `generateMetadata` para título dinâmico
  - `login/page.tsx` — client-only (fluxo OAuth)
  - `video/refresh/page.tsx` — Server Component com `metadata` (`robots: noindex,nofollow`) **e**
    o gate de acesso (A3, v4 Etapa 2): compara `?token=` com `process.env.VIDEO_REFRESH_TOKEN`
    (server-only) e chama `notFound()` se não bater — única exceção ao padrão "página só com
    metadata" nesta lista, por ser controle de acesso da própria rota, não dado de negócio. A
    lógica de negócio (dashboard de ações manuais) continua isolada em
    `_components/RefreshClient.tsx`. `video/refresh` é ferramenta operacional de uso interno
    (disparar reprocessamento do feed), não faz parte do produto público e não é linkada a
    partir de nenhuma navegação visível
  - `_components/` — filhos das rotas Server. `Trend`/`UserAll` (listagem pública além da
    página 1) e `UserLiked`/`UserDisliked`/`Subs` (dado por sessão) são `'use client'` — buscam
    via `services/api.ts` (axios) no próprio componente, não recebem dado pronto do pai (ver
    "Regra de renderização" abaixo); `UserTabs`/`HomeFeed` (abas Radix, decidem visibilidade das
    abas de sessão via `useAuth()`), `UndoableUserCard` (botão "Desmarcar"),
    `ChannelLikeButtons`/`UserLikeButtons`, formulário de login e dashboard de `video/refresh`
    também são `'use client'`
- `pages/api/` — Route Handler legado (Pages API route: `jsonbin`) — mantido fora do App Router
  porque só lê segredo de servidor puro (master key do JSONBin) sem estado de sessão do usuário,
  sem necessidade real de virar Route Handler do App Router; coexiste com `app/` sem conflito
- `components/` — componentes compartilhados (Header, Footer, Container, VideoThumbItem, UserItem, ChannelItem, Paginate); `DetailSkeleton` (esqueleto dos `loading.tsx` de detalhe); exportados via `components/index.ts`. Header/Footer/Paginate são `'use client'` (hooks/estado)
- `services/api.ts` — instância Axios client-only, usada pelos Client Components; Server Components usam `lib/fetchJSON.ts` (`fetch` nativo) em vez de axios
- `lib/fetchJSON.ts` — helper tipado de `fetch` para uso em Server Component, com timeout opcional
  (`timeoutMs`) via `DEFAULT_FETCH_TIMEOUT_MS` (5s) ou `COLD_START_TIMEOUT_MS` (55s, declarada aqui); `lib/fetchListing.ts` encapsula o padrão das 4
  listagens públicas (timeout + log da falha + override de `timeoutMs` por chamador — ver
  "Dados externos" abaixo pra timeout/fallback/`maxDuration`, iguais nas 4 desde a reversão de
  M1); `lib/fetchDetail.ts` encapsula o das
  3 páginas de detalhe (`video/user/channel [slug]`) — usa `cache()` do React por cima do
  `fetchJSON` porque passar `timeoutMs` anexa um `AbortSignal`, e isso faz o Next.js pular a
  deduplicação automática de fetch entre `generateMetadata` e a página (achado do fechamento v4);
  sem o `cache()`, cada page de detalhe dispararia 2 requests reais por carregamento
- `types/` — tipos de domínio compartilhados (`VideoData`, `ChannelData`) usados tanto por Server quanto Client Components
- `hooks/` — `auth.tsx` (autenticação) e `styleSwitcher.tsx` (tema claro/escuro) — client-only, guardados por `isServer()`
- `styles/css.d.ts` — declaração ambiente (`declare module '*.css'`) para imports de CSS como side-effect (`import './style.css'`) satisfazerem `tsc --noEmit`; o `next build`/`next dev` (webpack) já resolve isso nativamente, sem precisar da declaração
- `_deprecated/` — código experimental untracked (transcrição/IA), fora do escopo do app; não referenciado por nenhuma rota

### Regra de renderização

SSR/ISR só pra **página 1 da listagem pública** (`/`, `/video`, `/user`, `/channel`) e pras 3
páginas de detalhe (1 registro, `cache: 'no-store'`). Página 2+ da listagem pública e tudo que
depende da sessão do usuário logado (favoritos, não seguidos, inscrições) é CSR — `Trend`/
`UserAll`/`Subs`/`UserLiked`/`UserDisliked` são `'use client'` e buscam via `services/api.ts`
(axios). Reversão consciente de M1 (etapa 2 v3, que tinha movido a sessão pra Server Component):
ler `cookies()` **ou** `searchParams` num Server Component força a rota inteira a renderização
dinâmica no App Router — as 3 rotas que precisavam de um dos dois (cookie pra sessão,
`searchParams` pra paginação) ficavam sempre `ƒ Dynamic`, nunca `○ Static`, acoplando toda visita
comum à disponibilidade do backend (Render free tier, cold start reportado em ~30-60s — ver
`docs/limitacoes-conhecidas.md`), sintoma reproduzido em produção em 2026-09-22 como "home sem
registros". A sessão vive num cookie `httpOnly` setado pelo backend; o axios (`withCredentials`)
já manda esse cookie sozinho em toda request — nunca precisou de `cookies()`/`next/headers` pra
isso, só precisava saber que era esse o mecanismo (achado H2, etapa 2 v3: a razão documentada na
época, sessão em `localStorage`, estava errada). `useAuth()`/`isHydrated` (hook client-only,
`hooks/auth.tsx`) decide a visibilidade das abas de sessão (`HomeFeed`/`UserTabs`) — flash
aceito: a aba de sessão aparece um instante depois do primeiro paint pra quem está logado, em vez
de já vir pronta no HTML; a aba pública nunca espera hidratação (não repete o achado 4 daquela
etapa, que escondia a página inteira até hidratar). `Subs`/`UserLiked`/`UserDisliked` só montam
(e só buscam) dentro da aba de sessão correspondente — Radix `Tabs.Content` desmonta conteúdo de
aba inativa por padrão (sem `forceMount`), então isso elimina de graça o desperdício de fetch
"toda carga logada, mesmo com a aba fechada" que a versão Server Component antiga tinha (trade-off
documentado como aceito, PR #7 — não existe mais, não precisa ser vigiado de novo). Custo aceito
na paginação: `?page=N` deixa de ser link direto/compartilhável pra uma página específica da
listagem pública — volta a ser só estado local, como era antes da Etapa 2 v3 (`Paginate` com
`handlePaginate`, sem navegação por URL). `Paginate` chama `useSearchParams()` incondicionalmente
mesmo em modo controlado — cada uso dela dentro de `Trend`/`UserAll`/`Subs` fica envolto em
`<Suspense>` local, exigência do App Router pra essa API em página SSG (sem isso o build falha:
"useSearchParams() should be wrapped in a suspense boundary").

Detalhe completo do estado pré-M1 em
`../reactjs/improvements/v1/devfinder-next/devfinder-next-app-router-migration.md` e da migração
M1 em si em `../reactjs/improvements/v3/devfinder-next/2-debito-arquitetural.md` — esta reversão
volta pro modelo daquele primeiro documento (SSR só pra dado público, CSR pra dado de sessão),
não pro código literal de antes (o padrão `UndoableUserCard`, Client Component-folha que se
autoesconde no undo em vez de `useUndoList` refazendo a lista inteira, foi mantido — é
independente da decisão SSR vs. CSR e é estritamente melhor).

### Estilização

Usa **Tailwind CSS v4**, config CSS-first (`app/globals.css`: `@import "tailwindcss";` + bloco
`@theme`, sem `tailwind.config.ts` nem `postcss.config.js`/`autoprefixer` separados — só
`postcss.config.mjs` com o plugin `@tailwindcss/postcss`). Migrado de styled-components v6 (ADR
`docs/decisions/0002-styling-stack.md`) — decisão motivada por um bug real de perda de CSS em SSR
streaming (achado A1 do ADR 0002), não só preferência de stack; a migração resolveu esse bug pela
raiz (troca de motor, não patch).

Componentes com marcação própria usam classes utilitárias inline no `className`. Componentes com
`className` livre vindo de fora (múltiplos call sites) ou seletores descendentes que miram
marcação de outro componente (ex.: children injetado) usam um `style.css` co-localizado com
`@apply`, sempre com `@reference "<caminho para app/globals.css>";` no topo — obrigatório em
qualquer CSS fora do entrypoint que use `@apply` e precisa referenciar tokens do `@theme` do
projeto (`bg-background-weak` etc.), não só o tema padrão do Tailwind. CSS assim escrito (fora de
`@layer`) fica sem layer — o que já é o comportamento correto para essas regras, mas é o motivo
pelo qual o reset/global abaixo precisa estar em `@layer base` explicitamente: no Tailwind v4,
CSS sem layer sempre vence CSS dentro de qualquer layer, independente de especificidade — sem
`@layer base` no reset, ele venceria até as classes utilitárias do Tailwind aplicadas via
`className` (que ficam na layer `utilities`).

Radix UI (não estilizado, acessível por padrão) é usado pontualmente para primitivos onde
reimplementar acessibilidade à mão seria caro (`@radix-ui/react-tabs`) — decisão registrada em
`docs/decisions/0001-styling-stack.md`, não alterada pela migração de motor CSS. Os slots do
Radix Tabs (`Tabs.List`/`Tabs.Trigger`) recebem classes utilitárias diretamente, incluindo o
variant `data-[state=active]:` para o estado da aba ativa — sem CSS separado.

As cores (`@theme` em `app/globals.css`) chegam a todo componente — Server ou Client — via
variáveis CSS estáticas (`--color-*`), nunca via prop de tema de runtime; a escolha entre os dois
temas é feita por um atributo `data-theme` no `<html>`, aplicado por um script bloqueante em
`app/layout.tsx` antes do primeiro paint. Isso existe pra eliminar o flash de tema incorreto: como
a preferência salva só existe em `localStorage`, o servidor não tem como saber o tema do usuário
na resposta SSR, então nenhum componente pode depender de estado de runtime pra decidir cor — só
a CSS estática, resolvida no cliente antes de qualquer pintura.

### Dados externos

O backend REST em `NEXT_PUBLIC_API_URL` fornece os dados de vídeos, canais e usuários. As 4
listagens (`/`, `/video`, `/user`, `/channel`) buscam só a página 1 com `fetch` e
`next: { revalidate: 60 * 60 * 8 }` (ISR) — sem `searchParams`/`cookies()`, então ○ Static de
verdade (ver "Regra de renderização" acima). Detalhe usa `fetch` com `cache: 'no-store'`
(renderizado por request), com `loading.tsx` por segmento (`DetailSkeleton`) pra dar feedback
enquanto o backend acorda (streaming: ver trade-off do status 200 em
`docs/limitacoes-conhecidas.md`).

As 4 listagens e as 3 páginas de detalhe usam o mesmo timeout estendido (`COLD_START_TIMEOUT_MS`,
55s, `lib/fetchJSON.ts`) em vez do `DEFAULT_FETCH_TIMEOUT_MS` (5s, só o default de `fetchListing`
quando o chamador não passa `timeoutMs`; o feed de vídeos do canal, que roda depois de
`getChannel` já ter acordado o backend, usa `min(5s, orçamento restante de 58s)` pra não passar
do `maxDuration`) — cold start do Render free tier é reportado em ~30-60s,
bem acima dos 5s originais. Acompanhado de `export const maxDuration = 60` nas 7 `page.tsx`: sem
isso a Vercel mataria a função bem antes dos 55s (10s é o default do Hobby sem Fluid Compute); o timeout interno fica
abaixo do `maxDuration` de propósito, pra sempre ganhar a corrida contra o kill da plataforma e
devolver o fallback amigável em vez de um 504 cru dela. Não elimina o cold start (limitação de
terceiro, ver `docs/limitacoes-conhecidas.md`), só reduz bem a chance de um visitante esbarrar
nele. As 4 também fazem `.catch()` no call site do próprio `page.tsx` (não dentro de
`fetchListing`, que continua relançando por padrão — `review-human.md` #1) pra renderizar
`<FeedbackMessage message={LISTING_UNAVAILABLE_MESSAGE} />` só quando ainda não existe nenhuma
versão boa em cache pra proteger (1ª geração da rota, logo após um deploy) — uma revalidação de
fundo que falha continua preservando a última versão boa (comportamento nativo do Next), o
`.catch()` só cobre o caso sem nada bom ainda pra mostrar. Reproduzido em produção em
2026-09-22 (cold start do Render coincidindo com um deploy novo).

O antigo trade-off da seção de sessão (`Subs`/`UserLiked`/`UserDisliked` buscadas a cada carga
logada, mesmo com a aba fechada — PR #7) e o trade-off do timeout de listagem que se estendia a
ela (A4, v4 Etapa 2, Promise.all descartando o fetch de sessão quando a listagem falhava) não
existem mais desde a reversão de M1: sessão virou CSR, só monta (e só busca) dentro da própria
aba, e não compartilha `Promise.all` nenhum com a listagem pública — ver "Regra de renderização"
acima. Não precisa ser vigiado de novo como regressão.
