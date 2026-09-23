import { Container } from '../../components';

interface SessionErrorFallbackProps {
  message: string;
}

// Compartilhado por UserLiked/UserDisliked/Subs (Client Components, CSR) — erro no fetch de
// sessão não deve derrubar a página inteira, que também tem a listagem pública funcionando ao
// lado. 401 (sessão expirada/inválida) já é tratado à parte, globalmente, pelo interceptor de
// resposta do axios (`services/api.ts`, `handleResponseError` — toast + redirect pro /login);
// este fallback cobre qualquer outra falha (rede, timeout, 5xx).
export function SessionErrorFallback({ message }: SessionErrorFallbackProps) {
  return (
    <Container loading={false} unstylized className="container-full-width">
      <p role="alert">{message}</p>
    </Container>
  );
}
