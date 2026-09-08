/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  },
  images: {
    // Otimização de imagem da Vercel desligada globalmente: um crawler (meta-externalagent)
    // estourou a cota do plano Hobby varrendo o catálogo de vídeos (vercel-image-optimization-
    // quota.md). O fix inicial (H4, etapa 1 v3) cobriu só a thumbnail de vídeo — o ponto de
    // maior volume — via `unoptimized` local; qualquer outra rota com <Image> remota (UserItem,
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
  }
}

module.exports = nextConfig
