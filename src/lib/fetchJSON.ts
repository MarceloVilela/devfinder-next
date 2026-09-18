// Orçamento padrão pra qualquer fetch que precise falhar rápido em vez de esperar o timeout da
// plataforma — usado por `fetchListing`, `sessionFetch` e as páginas de detalhe. Único lugar
// declarado (achado de duplicação, fechamento v4): antes cada camada tinha sua própria cópia do
// mesmo número.
export const DEFAULT_FETCH_TIMEOUT_MS = 5000;

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
