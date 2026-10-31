// Orçamento padrão pra qualquer fetch que precise falhar rápido em vez de esperar o timeout da
// plataforma — usado por `fetchListing` (quando o chamador não passa `timeoutMs`). Único lugar
// declarado (achado de duplicação, fechamento v4): antes cada camada tinha sua própria cópia do
// mesmo número.
export const DEFAULT_FETCH_TIMEOUT_MS = 5000;

// Orçamento pra rotas que precisam esperar o cold start do Render free tier (reportado em
// ~30-60s, bem acima dos 5s do padrão): as 4 listagens públicas e as 3 páginas de detalhe.
// Fica abaixo dos 60s de `maxDuration` (route segment config) dessas 7 páginas de propósito: 60s
// é o teto do plano Hobby da Vercel — se o nosso próprio AbortSignal disparasse só nos 60s
// cravados, correria o risco de perder a corrida contra o kill da plataforma (que devolve um 504
// cru em vez do fallback amigável/`error.tsx`). Não é garantia contra todo cold start (o relato
// de "cerca de um minuto" às vezes passa disso), só reduz bastante a chance de estourar.
export const COLD_START_TIMEOUT_MS = 55_000;

export class HTTPError extends Error {
  status: number;

  constructor(status: number, path: string) {
    super(`Request failed: ${status} ${path}`);
    this.status = status;
  }
}

export async function fetchJSON<T>(
  path: string,
  init?: RequestInit & { timeoutMs?: number },
): Promise<T> {
  const { timeoutMs, signal, ...rest } = init ?? {};

  // AbortSignal.any preserva os dois gatilhos de cancelamento quando o chamador já passa um
  // `signal` próprio (ex. cancelamento por unmount) junto de `timeoutMs` — um spread simples
  // sobrescreveria o `signal` do chamador silenciosamente (achado #4, code-review Etapa 2).
  const combinedSignal = timeoutMs
    ? AbortSignal.any(signal ? [signal, AbortSignal.timeout(timeoutMs)] : [AbortSignal.timeout(timeoutMs)])
    : signal;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...rest,
    ...(combinedSignal ? { signal: combinedSignal } : {}),
  });

  if (!res.ok) {
    throw new HTTPError(res.status, path);
  }

  return res.json() as Promise<T>;
}
