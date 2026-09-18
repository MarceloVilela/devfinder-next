import { DEFAULT_FETCH_TIMEOUT_MS, fetchJSON } from './fetchJSON';

// Shape repetido em 3 interfaces quase idênticas (TrendingFeed/DevsFeed/ChannelFeed, achado do
// fechamento v4) só por causa do tipo de item — uma única interface genérica em vez de 3 cópias.
export interface ListingFeed<T> {
  docs: T[];
  total: number;
  itemsPerPage: number;
}

// Encapsula o padrão repetido nas 4 listagens públicas (achado #8, code-review Etapa 2):
// timeout curto + log da falha real (achado #3 — sem isso não há como medir com que frequência
// a falha acontece em produção). Não engole mais o erro (ver review-human.md #1): sob ISR
// (`next: { revalidate }`), um `catch` que devolve `null` faz a página renderizar "com sucesso"
// mostrando o fallback, e o Next cacheia esse fallback como se fosse a nova página boa — troca a
// última versão válida por uma mensagem de erro até a próxima revalidação. Relançar deixa o Next
// aplicar o próprio comportamento nativo de ISR (mantém servindo a última versão boa em cache e
// só tenta de novo depois); só sobe pro `error.tsx` global quando ainda não existe nenhuma
// versão boa em cache pra proteger (ex. primeira geração da rota, logo após um deploy).
export async function fetchListing<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    return await fetchJSON<T>(path, { ...init, timeoutMs: DEFAULT_FETCH_TIMEOUT_MS });
  } catch (error) {
    console.error(`[fetchListing] falha ao buscar ${path}:`, error);
    throw error;
  }
}
