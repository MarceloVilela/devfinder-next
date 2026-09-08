import { ReactNode } from 'react';

import { redirectIfSessionExpired } from '../../lib/fetchSessionJSON';
import { SessionErrorFallback } from './SessionErrorFallback';

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
