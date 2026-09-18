import { DEFAULT_FETCH_TIMEOUT_MS, fetchJSON } from './fetchJSON';

export const LISTING_UNAVAILABLE_MESSAGE = 'Não foi possível carregar. Tente novamente em instantes.';

// Shape repetido em 3 interfaces quase idênticas (TrendingFeed/DevsFeed/ChannelFeed, achado do
// fechamento v4) só por causa do tipo de item — uma única interface genérica em vez de 3 cópias.
export interface ListingFeed<T> {
  docs: T[];
  total: number;
  itemsPerPage: number;
}

// Encapsula o padrão repetido nas 4 listagens públicas (achado #8, code-review Etapa 2):
// timeout curto + log da falha real (achado #3 — sem isso não há como medir com que frequência
// o fallback aparece em produção) + `null` pro chamador decidir o fallback visual
// (`LISTING_UNAVAILABLE_MESSAGE`/`FeedbackMessage`).
export async function fetchListing<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    return await fetchJSON<T>(path, { ...init, timeoutMs: DEFAULT_FETCH_TIMEOUT_MS });
  } catch (error) {
    console.error(`[fetchListing] falha ao buscar ${path}:`, error);
    return null;
  }
}
