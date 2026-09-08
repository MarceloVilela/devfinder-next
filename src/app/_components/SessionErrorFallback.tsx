import { Container } from '../../components';

interface SessionErrorFallbackProps {
  message: string;
}

// Compartilhado por UserLiked/UserDisliked/Subs — erro no fetch de sessão (que não seja 401,
// tratado à parte via fetchSessionOrRedirect) não deve derrubar a página inteira, que também
// tem a listagem pública funcionando ao lado. Mensagem inline em vez de toast — Server
// Component não tem acesso a react-toastify em render.
export function SessionErrorFallback({ message }: SessionErrorFallbackProps) {
  return (
    <Container loading={false} unstylized className="container-full-width">
      <p role="alert">{message}</p>
    </Container>
  );
}
