// tsc standalone (fora do `next build`) não resolve imports de CSS puro — Next.js resolve via
// webpack em tempo de build, sem gerar declaração de tipo própria pra isso. Padrão idiomático de
// projetos Next/Vite/CRA: um module wildcard, em vez de `// @ts-ignore` repetido em cada arquivo
// `style.css` da migração styled-components → Tailwind (ADR 0002).
declare module '*.css';
