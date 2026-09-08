import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { fetchJSON, HTTPError } from './fetchJSON';

const SESSION_COOKIE = 'devfinder_token';

export async function getSessionToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value;
}

// cache: 'no-store' — dado por sessão nunca pode entrar no cache de fetch do Next (duas
// pessoas acessando a mesma rota receberiam a resposta cacheada de quem passou primeiro).
export async function fetchSessionJSON<T>(path: string, token: string): Promise<T> {
  return fetchJSON<T>(path, {
    cache: 'no-store',
    headers: { Cookie: `${SESSION_COOKIE}=${token}` },
  });
}

// Cookie presente mas inválido/expirado (revogado, backend reiniciado, TTL bateu) — o
// interceptor Axios do client (services/api.ts, handleResponseError) tratava isso pra toda
// chamada autenticada fora de /me: toast "Sessão expirada" + redirect pro /login. Server
// Component não tem toast (só existe em Client Component), então só o redirect é reproduzido
// aqui — achado no code-review da migração (etapa 2 v3): sem isso, um 401 vinha só como erro
// genérico inline, sem levar o usuário a reautenticar.
//
// Chamar direto dentro do catch de quem usa fetchSessionJSON (não encapsular numa função
// async própria com try/catch em volta do redirect) — o redirect() do Next funciona lançando
// um erro especial que precisa escapar sem ser recapturado; um catch-all envolvendo essa
// chamada engoliria o redirect e cairia no fallback genérico em vez de navegar.
export function redirectIfSessionExpired(error: unknown): void {
  if (error instanceof HTTPError && error.status === 401) {
    redirect('/login');
  }
}
