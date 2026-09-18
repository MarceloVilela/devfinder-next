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
```

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha os valores:

```
NEXT_PUBLIC_API_URL=http://localhost:3333/v1   # API backend externa
```

## Arquitetura

**DevFinder** é um app Next.js (**App Router**) que agrega conteúdo de tecnologia em português: vídeos do YouTube, perfis de usuários GitHub e canais.

### Estrutura de `src/`

- `app/` — rotas Next.js (App Router)
  - `layout.tsx` — layout raiz (`<html>/<body>`, fontes, metadata base)
  - `providers.tsx` — `'use client'`: Redux, hidratação de auth/tema, `ToastContainer`
  - `not-found.tsx`, `error.tsx` — páginas de erro (404/500)
  - `page.tsx`, `video/page.tsx`, `user/page.tsx`, `channel/page.tsx` — listagens, Server Component com `fetch` + ISR de 8h
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
  - `_components/` — filhos das rotas Server, mistura Server e Client Component conforme
    precisa de interatividade ou não: `UserLiked`/`UserDisliked`/`Subs` (dado por sessão) são
    Server Component, igual às listagens/detalhe públicos; `UserTabs`/`HomeFeed` (abas Radix),
    `UndoableUserCard` (botão "Desmarcar"), `ChannelLikeButtons`/`UserLikeButtons`, formulário
    de login e dashboard de `video/refresh` são `'use client'` — só a folha interativa, nunca a
    árvore de busca de dado (ver "Regra de renderização" abaixo)
- `pages/api/` — Route Handler legado (Pages API route: `jsonbin`) — mantido fora do App Router
  porque só lê segredo de servidor puro (master key do JSONBin) sem estado de sessão do usuário,
  sem necessidade real de virar Route Handler do App Router; coexiste com `app/` sem conflito
- `components/` — componentes compartilhados (Header, Footer, Container, VideoThumbItem, UserItem, ChannelItem, Paginate); exportados via `components/index.ts`. Header/Footer/Paginate são `'use client'` (hooks/estado)
- `services/api.ts` — instância Axios client-only, usada pelos Client Components; Server Components usam `lib/fetchJSON.ts` (`fetch` nativo) em vez de axios
- `lib/fetchJSON.ts` — helper tipado de `fetch` para uso em Server Component, com timeout opcional
  (`timeoutMs`) via `DEFAULT_FETCH_TIMEOUT_MS`; `lib/fetchListing.ts` encapsula o padrão das 4
  listagens públicas (timeout + catch + fallback amigável); `lib/fetchDetail.ts` encapsula o das
  3 páginas de detalhe (`video/user/channel [slug]`) — usa `cache()` do React por cima do
  `fetchJSON` porque passar `timeoutMs` anexa um `AbortSignal`, e isso faz o Next.js pular a
  deduplicação automática de fetch entre `generateMetadata` e a página (achado do fechamento v4);
  sem o `cache()`, cada page de detalhe dispararia 2 requests reais por carregamento
- `types/` — tipos de domínio compartilhados (`VideoData`, `ChannelData`) usados tanto por Server quanto Client Components
- `hooks/` — `auth.tsx` (autenticação) e `styleSwitcher.tsx` (tema claro/escuro) — client-only, guardados por `isServer()`
- `styles/css.d.ts` — declaração ambiente (`declare module '*.css'`) para imports de CSS como side-effect (`import './style.css'`) satisfazerem `tsc --noEmit`; o `next build`/`next dev` (webpack) já resolve isso nativamente, sem precisar da declaração
- `_deprecated/` — código experimental untracked (transcrição/IA), fora do escopo do app; não referenciado por nenhuma rota

### Regra de renderização

SSR/ISR para **todas** as rotas — listagem (N registros), detalhe (1 registro) **e** as telas
que dependem da sessão do usuário logado (favoritos, não seguidos, inscrições). A sessão vive
num cookie `httpOnly` setado pelo backend; o Server Component lê esse cookie via `next/headers`
(`cookies()`, `lib/fetchSessionJSON.ts`) e o reenvia manualmente no `fetch` pro backend — o
`fetch` nativo do servidor não herda cookies do navegador automaticamente. Só a interatividade em
si (toggle de like/dislike, botão de desmarcar, paginação) fica em Client Components na folha da
árvore — a busca de dado, incluindo a personalizada, é Server Component. Detalhe completo em
`../reactjs/improvements/v1/devfinder-next/devfinder-next-app-router-migration.md` (estado
anterior a esta migração) e `../reactjs/improvements/v3/devfinder-next/2-debito-arquitetural.md`
(M1, a migração em si).

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

O backend REST em `NEXT_PUBLIC_API_URL` fornece os dados de vídeos, canais e usuários. Listagens
usam `fetch` com `next: { revalidate: 60 * 60 * 8 }` (ISR); detalhe usa `fetch` com
`cache: 'no-store'` (renderizado por request).

Trade-off aceito (M1): as 3 seções de sessão (`Subs` em `/` e `/video`, `UserLiked`/`UserDisliked`
em `/user`) são buscadas a cada carga logada da rota correspondente, independente de qual aba
está ativa — o Radix Tabs só evita re-render client-side da aba inativa, não o fetch
server-side que já resolveu o Server Component passado como prop. Decisão consciente (sem custo
de transformação de imagem associado, só requests de dado), não um bug — ver PR #7.

Mesmo trade-off se estende ao timeout de listagem (A4, v4 Etapa 2): a seção de sessão roda no
mesmo `Promise.all` da listagem pública, então toda vez que a listagem falha o fetch/render da
seção de sessão já foi disparado em paralelo e é descartado — desde `review-human.md` #1,
`fetchListing` relança o erro em vez de devolver `null`, e a página inteira (session incluída)
aborta via exceção pro `error.tsx` global, em vez do antigo `if (!trend) return
<FeedbackMessage />`; o desperdício descrito aqui é o mesmo, só muda o mecanismo de descarte. Ir
sequencial (só buscar sessão depois de confirmar a listagem) eliminaria esse desperdício, mas
custaria uma rodada extra de latência no caminho comum (listagem OK, que é a maioria dos casos)
pra economizar uma request rara (backend fora do ar). Mantido paralelo por ser o trade-off menos
custoso no caso comum — sinalizado aqui pra não ser achado de novo como se fosse regressão não
intencional (achado do fechamento v4).
