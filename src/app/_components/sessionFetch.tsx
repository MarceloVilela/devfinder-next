import { ReactNode } from 'react';

import { DEFAULT_FETCH_TIMEOUT_MS } from '../../lib/fetchJSON';
import { redirectIfSessionExpired } from '../../lib/fetchSessionJSON';
import { SessionErrorFallback } from './SessionErrorFallback';

// Mesmo orçamento do timeout das listagens públicas (`lib/fetchJSON.ts`, `DEFAULT_FETCH_TIMEOUT_MS`)
// — sem isso, um backend lento travava a página inteira mesmo com a listagem pública já com
// timeout (achado #1, code-review Etapa 2): Subs/UserLiked/UserDisliked corriam no mesmo
// `Promise.all` da listagem, sem limite de tempo próprio. Reexportado com este nome porque
// `fetchSessionJSON` (chamador) já espera um timeout nomeado por contexto de sessão.
export const SESSION_FETCH_TIMEOUT_MS = DEFAULT_FETCH_TIMEOUT_MS;

// Extrai o formato repetido em UserLiked/UserDisliked/Subs (achado no code-review da
// migração): busca o dado da sessão, redireciona pro /login se o cookie estiver
// inválido/expirado, cai num fallback inline pra qualquer outra falha — só o fetch em si e o
// JSX de sucesso mudam por chamador.
export async function resolveSessionSection<T>(
  fetcher: () => Promise<T>,
  errorMessage: string,
  render: (data: T) => ReactNode,
): Promise<ReactNode> {
  try {
    const data = await fetcher();
    return render(data);
  } catch (error) {
    redirectIfSessionExpired(error);
    return <SessionErrorFallback message={errorMessage} />;
  }
}
