import { DEFAULT_FETCH_TIMEOUT_MS, fetchJSON } from './fetchJSON';

export const LISTING_UNAVAILABLE_MESSAGE = 'Não foi possível carregar. Tente novamente em instantes.';

// Timeout estendido só pra `/`, `/user` e `/channel` (não `/video`) — cold start do Render free
// tier é reportado em ~30-60s, bem acima dos 5s de `DEFAULT_FETCH_TIMEOUT_MS`. Fica abaixo dos
// 60s de `maxDuration` (route segment config) dessas 3 páginas de propósito: no plano Hobby da
// Vercel sem Fluid Compute, 60s é o teto rígido de duração de função — se o nosso próprio
// AbortSignal disparasse só nos 60s cravados, corre risco de perder a corrida contra o kill da
// própria plataforma (que devolve um 504 cru em vez do fallback amigável do `.catch()` no call
// site). Não é garantia contra todo cold start (o relato de "cerca de um minuto" às vezes passa
// disso), só reduz bastante a chance de estourar.
export const LISTING_COLD_START_TIMEOUT_MS = 55_000;

// Shape repetido em 3 interfaces quase idênticas (TrendingFeed/DevsFeed/ChannelFeed, achado do
// fechamento v4) só por causa do tipo de item — uma única interface genérica em vez de 3 cópias.
export interface ListingFeed<T> {
  docs: T[];
  total: number;
  itemsPerPage: number;
}

// Encapsula o padrão repetido nas 4 listagens públicas (achado #8, code-review Etapa 2):
// timeout curto + log da falha real (achado #3 — sem isso não há como medir com que frequência
// a falha acontece em produção). Continua relançando por padrão (review-human.md #1): sob ISR
// (`next: { revalidate }`), um `catch` aqui dentro que devolvesse `null` faria a página renderizar
// "com sucesso" mostrando o fallback, e o Next cachearia esse fallback como se fosse a nova
// página boa — trocando a última versão válida por uma mensagem de erro até a próxima
// revalidação. Relançar deixa o Next aplicar o próprio comportamento nativo de ISR (mantém
// servindo a última versão boa em cache e só tenta de novo depois); só sobe pro `error.tsx`
// global quando ainda não existe nenhuma versão boa em cache pra proteger (ex. primeira geração
// da rota, logo após um deploy) — cenário real em produção contra o Render (cold start do free
// tier facilmente estoura os 5s do timeout, e o deploy mais recente zera o cache de dado da
// rota). `/`, `/user` e `/channel` (não `/video`, nem as 3 páginas de detalhe, que não têm essa
// proteção por design — ver comentário local em cada uma) fazem `.catch()` no call site pra
// cobrir justo esse cenário sem reverter esse throw default aqui: aceitam de volta, só nesses 3
// pontos, o risco de cache poisoning que motivou o commit original (uma falha transitória
// durante revalidação em background também vira o fallback amigável cacheado por até 8h) —
// trade-off pedido explicitamente porque a alternativa (usuário direto no error.tsx global logo
// após qualquer deploy que coincida com o backend dormindo) foi considerada pior.
export async function fetchListing<T>(
  path: string,
  init?: RequestInit & { timeoutMs?: number },
): Promise<T> {
  const { timeoutMs = DEFAULT_FETCH_TIMEOUT_MS, ...rest } = init ?? {};

  try {
    return await fetchJSON<T>(path, { ...rest, timeoutMs });
  } catch (error) {
    console.error(`[fetchListing] falha ao buscar ${path}:`, error);
    throw error;
  }
}
