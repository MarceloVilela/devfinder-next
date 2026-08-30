# DevFinder

<div align="center">
    <img alt="DevFinder" title="DevFinder" src=".github/preview-540p.gif" />
</div>

<br />
<strong>Vídeos, devs e canais sobre Tecnologia, Desenvolvimento e Programação em Português, reunidos em um só lugar.</strong>

## Sobre

- **Vídeos**: conteúdo sobre tecnologia, desenvolvimento e programação em português, reunido em um feed único.
- **Usuários GitHub**: perfis de desenvolvedores da comunidade, para descobrir e acompanhar.
- **Canais**: canais de tecnologia organizados por tema — filtro por categoria, não só uma lista solta. Temas incluem Desenvolvimento Back-End, Desenvolvimento Front-End, Desenvolvimento Mobile Nativo & Híbrido, Banco de Dados & Bancos Não Relacionais, Infraestrutura, Linux, Segurança, Inteligência Artificial, Lógica de Programação, Games, e Entrevista/Webinars & Dicas.
- **Busca unificada**: encontre vídeo ou canal direto pela barra de busca, sem precisar navegar por menus.

## Stack

| Camada | Tecnologias |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Estilização | styled-components v6 (SSR via registry próprio) |
| Estado | Redux Toolkit — slices segmentados por domínio |
| Autenticação | OAuth GitHub, backend próprio (`devfinder-api`) |
| Data fetching | `fetch` nativo (Server Components, SSR/ISR) + Axios (Client Components) |
| Testes | Jest, Testing Library |

## Demostração

Caso deseje visualizar aplicação antes de instalar, você pode acessar o <a href="https://dev-finder.netlify.app/">link da aplicação</a> que esta hospedada na Netlify.

# Para executar locamente:

#### 1.Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/). 
Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

#### 2.Instalação

Para a instalação do projeto, primeiramente baixe o <a href="https://nodejs.org/en/">Node.js</a>.

Após a instalação do Node, você deve clonar o repositório:
```bash
git clone https://github.com/MarceloVilela/devfinder-next.git
```
Após a clonagem, execute o comando abaixo dentro da pasta do projeto para baixar todas as dependências:
```bash
pnpm install
```

#### 3.Variáveis ambiente
Crie um arquivo .env, 
copie o conteúdo do arquivo .env.example e cole dentro de .env,
altere caso necessário.

#### 4.Como utilizar

Após clonar, execute o comando abaixo:

```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) em seu navegador para utilizar a aplicação.

## Arquitetura de renderização

App Router. SSR/ISR em **todas** as rotas de dado público — listagem (`/`, `/video`, `/user`,
`/channel`, revalidação de 8h) e detalhe (`/user/:slug`, `/video/:slug`, `/channel/:slug`,
renderizado por request, sem `generateStaticParams` porque o conjunto de slugs é aberto). A
interatividade (like/dislike, paginação além da página 1) fica isolada em Client Components na
folha da árvore. A única exceção é o que depende da sessão do usuário logado (favoritos,
inscrições) — a sessão vive em `localStorage`, inacessível a um Server Component sem cookie
`httpOnly`, então essas telas continuam CSR.