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
pnpm lint     # ESLint via next lint
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
  - `registry.tsx` — registro de `styled-components` para SSR (`useServerInsertedHTML`)
  - `providers.tsx` — `'use client'`: Redux, `ThemeProvider`, hidratação de auth/tema, `ToastContainer`
  - `not-found.tsx`, `error.tsx` — páginas de erro (404/500)
  - `page.tsx`, `video/page.tsx`, `user/page.tsx`, `channel/page.tsx` — listagens, Server Component com `fetch` + ISR de 8h
  - `user/[slug]/page.tsx`, `video/[slug]/page.tsx`, `channel/[slug]/page.tsx` — detalhe, Server Component renderizado por request (`cache: 'no-store'`, sem `generateStaticParams` — o conjunto de slugs é aberto); usam `generateMetadata` para título dinâmico
  - `login/page.tsx`, `video/refresh/page.tsx` — client-only (fluxo OAuth, dashboard de ações manuais).
    `video/refresh` é ferramenta operacional de uso interno (disparar reprocessamento do feed),
    não faz parte do produto público e não é linkada a partir de nenhuma navegação visível
  - `_components/` — Client Components (`'use client'`) usados como filhos das rotas Server: paginação, abas, botões de like/dislike/undo, formulário de login
- `pages/api/` — Route Handlers legados (Pages API routes: `hello`, `jsonbin`, `video-refresh`) — coexistem com `app/` sem conflito
- `components/` — componentes compartilhados (Header, Footer, Container, VideoThumbItem, UserItem, ChannelItem, Paginate, IconCategory); exportados via `components/index.ts`. Header/Footer/Paginate/IconCategory são `'use client'` (hooks/estado)
- `services/api.ts` — instância Axios client-only, usada pelos Client Components; Server Components usam `lib/fetchJSON.ts` (`fetch` nativo) em vez de axios
- `lib/fetchJSON.ts` — helper tipado de `fetch` para uso em Server Component
- `types/` — tipos de domínio compartilhados (`VideoData`, `ChannelData`) usados tanto por Server quanto Client Components
- `hooks/` — `auth.tsx` (autenticação) e `styleSwitcher.tsx` (tema claro/escuro) — client-only, guardados por `isServer()`
- `styles/` — `GlobalStyle.ts`, `Theme.ts` e declarações TypeScript para styled-components
- `_deprecated/` — código experimental untracked (transcrição/IA), fora do escopo do app; não referenciado por nenhuma rota

### Regra de renderização

SSR/ISR para **todas** as rotas de dado público — listagem (N registros) e detalhe (1 registro):
ambas viram Server Component. A distinção real é **dado público vs. dado que depende da sessão do
usuário logado** — este último (`Liked`/`Disliked`/`Subs`, dentro de `_components/`) continua
Client Component porque a sessão vive em `localStorage`, inacessível a um Server Component sem
cookie `httpOnly` (mudança de backend, ainda não feita). Detalhe completo em
`../reactjs/improvements/devfinder-next-app-router-migration.md`.

### Estilização

Usa **styled-components v6** com a transformação SWC habilitada em `next.config.js`, mais o
registry de SSR em `app/registry.tsx` (necessário no App Router — sem ele o CSS não é injetado no
`<head>` do HTML gerado no servidor). Cada rota tem um `style.ts` local com os componentes
estilizados. Radix UI (não estilizado, acessível por padrão) é usado pontualmente para primitivos
onde reimplementar acessibilidade à mão seria caro (`@radix-ui/react-tabs`) — decisão registrada
em `docs/decisions/0001-styling-stack.md`.

As cores (`styles/Theme.ts`) chegam a todo componente — Server ou Client — via variáveis CSS
estáticas definidas em `styles/GlobalStyle.ts` (`--color-*`), nunca via `props.theme.*` de
styled-components; a escolha entre os dois temas é feita por um atributo `data-theme` no `<html>`,
aplicado por um script bloqueante em `app/layout.tsx` antes do primeiro paint. Isso existe pra
eliminar o flash de tema incorreto: como a preferência salva só existe em `localStorage`, o
servidor não tem como saber o tema do usuário na resposta SSR, então nenhum componente pode
depender do `theme` prop do `ThemeProvider` pra decidir cor — só a CSS estática, resolvida no
cliente antes de qualquer pintura.

### Dados externos

O backend REST em `NEXT_PUBLIC_API_URL` fornece os dados de vídeos, canais e usuários. Listagens
usam `fetch` com `next: { revalidate: 60 * 60 * 8 }` (ISR); detalhe usa `fetch` com
`cache: 'no-store'` (renderizado por request).
