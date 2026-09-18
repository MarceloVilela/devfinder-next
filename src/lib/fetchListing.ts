import { fetchJSON } from './fetchJSON';

const LISTING_TIMEOUT_MS = 5000;

export const LISTING_UNAVAILABLE_MESSAGE = 'Não foi possível carregar. Tente novamente em instantes.';

// Encapsula o padrão repetido nas 4 listagens públicas (achado #8, code-review Etapa 2):
// timeout curto + log da falha real (achado #3 — sem isso não há como medir com que frequência
// o fallback aparece em produção) + `null` pro chamador decidir o fallback visual
// (`LISTING_UNAVAILABLE_MESSAGE`/`FeedbackMessage`).
export async function fetchListing<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    return await fetchJSON<T>(path, { ...init, timeoutMs: LISTING_TIMEOUT_MS });
  } catch (error) {
    console.error(`[fetchListing] falha ao buscar ${path}:`, error);
    return null;
  }
}
