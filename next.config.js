/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Otimização de imagem da Vercel desligada globalmente: um crawler (meta-externalagent)
    // estourou a cota do plano Hobby varrendo o catálogo de vídeos — 9,2K de 9,2K edge
    // requests em 12h, 8,5K delas em /_next/image, 1% cache hit (observado direto no
    // dashboard da Vercel na hora do incidente; achado H4, etapa 1 v3). O fix inicial cobriu
    // só a thumbnail de vídeo — o ponto de maior volume — via `unoptimized` local; qualquer
    // outra rota com <Image> remota (UserItem,
    // ChannelItem, páginas de detalhe user/channel/video, todas sem cache de ISR) continuava
    // exposta ao mesmo risco. Todas as imagens remotas (YouTube, GitHub) já vêm pré-
    // dimensionadas da fonte, então a otimização não agregava valor visual que justifique manter
    // esse risco de custo em aberto (achado no code-review da etapa 2 v3).
    unoptimized: true,
    remotePatterns: [
      // mantido como documentação dos hosts servidos, mesmo com unoptimized: true — se a
      // otimização for religada no futuro, a allowlist já está pronta
      // YouTube usa múltiplos subdomínios de CDN para thumbnail (i.ytimg.com, i1-i4.ytimg.com)
      { protocol: 'https', hostname: '*.ytimg.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      // GitHub também serviu avatares por avatars0-3.githubusercontent.com (registros antigos)
      { protocol: 'https', hostname: '*.githubusercontent.com' },
      // avatar de canal: yt3.ggpht.com (legado) e yt3.googleusercontent.com (atual)
      { protocol: 'https', hostname: 'yt3.ggpht.com' },
      { protocol: 'https', hostname: 'yt3.googleusercontent.com' },
    ],
  },

  // Proxy reverso pro backend (review-human.md #2) — faz o navegador só falar com o domínio do
  // frontend, nunca direto com o Render. Sem isso, o cookie de sessão httpOnly que o backend
  // seta na resposta do OAuth nasce escopado ao domínio do backend (`onrender.com`), e nunca
  // chega no `next/headers` `cookies()` que os Server Components leem (domínios sem sufixo
  // compartilhado) — as seções de sessão (Subs/UserLiked/UserDisliked) somem em produção mesmo
  // com o usuário logado. Prefixo `/backend` (não `/api`) de propósito: `/api/jsonbin.ts`
  // (Pages Router, rota legada) já ocupa `/api/*` — um rewrite `/api/:path*` engoliria essa rota.
  // Sozinho, este rewrite não tem efeito nenhum (nada chama `/backend/*` ainda) — só passa a
  // valer quando `services/api.ts` apontar pra cá E o callback OAuth no GitHub for atualizado
  // pra `https://devfinder.vercel.app/backend/auth/github/callback` (painel do GitHub, manual,
  // fora deste repo) — as duas pontas precisam subir juntas, senão o login quebra no meio do
  // caminho (ver "Passos" em review-human.md #2).
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
}

module.exports = nextConfig
