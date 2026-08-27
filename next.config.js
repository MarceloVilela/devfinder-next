/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  },
  images: {
    remotePatterns: [
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
