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

**DevFinder** é um app Next.js (Pages Router) que agrega conteúdo de tecnologia em português: vídeos do YouTube, perfis de usuários GitHub e canais.

### Estrutura de `src/`

- `pages/` — rotas Next.js (Pages Router)
  - `video/[slug].tsx` — detalhe do vídeo com geração de texto por IA
  - `channel/`, `user/`, `login/` — demais seções
- `components/` — componentes compartilhados (Header, Footer, Container, VideoThumbItem, UserItem, ChannelItem, Paginate, IconCategory); exportados via `components/index.ts`
- `services/api.ts` — instância Axios apontando para `NEXT_PUBLIC_API_URL`; trata erros 401 redirecionando para login
- `hooks/` — `auth.tsx` (autenticação) e `styleSwitcher.tsx` (tema claro/escuro)
- `styles/` — `GlobalStyle.ts`, `Theme.ts` e declarações TypeScript para styled-components

### Estilização

Usa **styled-components v6** com a transformação SWC habilitada em `next.config.js`. Cada página tem um arquivo `*Style.ts` separado com os componentes estilizados.

### Dados externos

O backend REST em `NEXT_PUBLIC_API_URL` fornece os dados de vídeos, canais e usuários. A página inicial usa `getStaticProps` com revalidação de 8 horas (ISR).
