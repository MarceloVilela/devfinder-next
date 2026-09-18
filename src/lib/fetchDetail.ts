import { cache } from 'react';

import { DEFAULT_FETCH_TIMEOUT_MS, fetchJSON } from './fetchJSON';

// `generateMetadata` e a página em si chamam a mesma função de busca com o mesmo path
// (video/[slug], user/[slug], channel/[slug]) — o Next.js dedupe automaticamente esse par numa
// única request de rede *desde que nenhum `signal` seja passado ao fetch*. `fetchJSON` com
// `timeoutMs` sempre anexa um `AbortSignal` (Next trata isso como ciclo de vida controlado por
// fora, e pula a memoização própria dele) — sem `cache()` do React aqui, cada page de detalhe
// passou a disparar 2 requests reais por carregamento em vez de 1 assim que o timeout foi
// adicionado (achado do fechamento v4). `cache()` memoiza por argumentos dentro do mesmo
// request/render, independente do que o Next faz por baixo do fetch.
export const fetchDetail = cache(async function fetchDetail<T>(path: string): Promise<T | null> {
  return fetchJSON<T | null>(path, { cache: 'no-store', timeoutMs: DEFAULT_FETCH_TIMEOUT_MS });
});
