import { cache } from 'react';

import { COLD_START_TIMEOUT_MS, fetchJSON } from './fetchJSON';

// `generateMetadata` e a página em si chamam a mesma função de busca com o mesmo path
// (video/[slug], user/[slug], channel/[slug]) — o Next.js dedupe automaticamente esse par numa
// única request de rede *desde que nenhum `signal` seja passado ao fetch*. `fetchJSON` com
// `timeoutMs` sempre anexa um `AbortSignal` (Next trata isso como ciclo de vida controlado por
// fora, e pula a memoização própria dele) — sem `cache()` do React aqui, cada page de detalhe
// passou a disparar 2 requests reais por carregamento em vez de 1 assim que o timeout foi
// adicionado (achado do fechamento v4). `cache()` memoiza por argumentos dentro do mesmo
// request/render, independente do que o Next faz por baixo do fetch.
//
// Timeout de cold start (não o de 5s do padrão): detalhe é renderizado por request, sem cache
// de ISR, então com o Render dormindo (~30-60s) 5s estourava sistematicamente e caía no
// `error.tsx`. Acompanhado de `maxDuration = 60` nas 3 páginas e de `loading.tsx` por segmento.
export const fetchDetail = cache(async function fetchDetail<T>(path: string): Promise<T | null> {
  return fetchJSON<T | null>(path, { cache: 'no-store', timeoutMs: COLD_START_TIMEOUT_MS });
});
