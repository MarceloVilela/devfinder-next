import { DEFAULT_FETCH_TIMEOUT_MS, fetchJSON } from './fetchJSON';

export const LISTING_UNAVAILABLE_MESSAGE = 'Não foi possível carregar. Tente novamente em instantes.';

// Shape repetido em 3 interfaces quase idênticas (TrendingFeed/DevsFeed/ChannelFeed, achado do
// fechamento v4) só por causa do tipo de item — uma única interface genérica em vez de 3 cópias.
export interface ListingFeed<T> {
  docs: T[];
  total: number;
  itemsPerPage: number;
}

// ATENÇÃO: sem `timeoutMs` o default é `DEFAULT_FETCH_TIMEOUT_MS` (5s), que estoura em todo cold
// start do Render (~30-60s). Chamador cuja rota pode esbarrar num backend dormindo deve passar
// `COLD_START_TIMEOUT_MS` (lib/fetchJSON.ts) junto de um `maxDuration` maior; só passe o default
// quando o backend já foi acordado por uma chamada anterior da mesma rota (ex.: o feed do canal).
//
// Encapsula o padrão repetido nas 4 listagens públicas (achado #8, code-review Etapa 2):
// timeout + log da falha real (achado #3 — sem isso não há como medir com que frequência
// a falha acontece em produção). Continua relançando por padrão (review-human.md #1): sob ISR
// (`next: { revalidate }`), um `catch` aqui dentro que devolvesse `null` faria a página renderizar
// "com sucesso" mostrando o fallback, e o Next cachearia esse fallback como se fosse a nova
// página boa — trocando a última versão válida por uma mensagem de erro até a próxima
// revalidação. Relançar deixa o Next aplicar o próprio comportamento nativo de ISR (mantém
// servindo a última versão boa em cache e só tenta de novo depois); só sobe pro `error.tsx`
// global quando ainda não existe nenhuma versão boa em cache pra proteger (ex. primeira geração
// da rota, logo após um deploy) — cenário real em produção contra o Render (cold start do free
// tier facilmente estoura os 5s do timeout, e o deploy mais recente zera o cache de dado da
// rota). As 4 listagens (`/`, `/video`, `/user` e `/channel`; não as 3 páginas de detalhe, que
// não têm essa proteção por design — ver comentário local em cada uma) fazem `.catch()` no call
// site pra cobrir justo esse cenário sem reverter esse throw default aqui: aceitam de volta, só
// nesses 4 pontos, o risco de cache poisoning que motivou o commit original (uma falha transitória
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
