import { Container } from '../../components';
import UsersList from '../user/style';
import { UserData } from '../../hooks/auth';
import { fetchSessionJSON } from '../../lib/fetchSessionJSON';
import { UndoableUserCard } from './UndoableUserCard';
import { resolveSessionSection } from './sessionFetch';

interface UserLikedProps {
  token: string;
}

// Server Component (M1, etapa 2 v3) — só renderiza quando há token (isLoggedIn decidido no
// pai, user/page.tsx), então o guard de visitante que existia na versão CSR não faz mais
// sentido aqui: quem não tem sessão nunca chega a instanciar este componente.
export default async function UserLiked({ token }: UserLikedProps) {
  return resolveSessionSection(
    () => fetchSessionJSON<UserData[]>('/likes/devs', token),
    'Não foi possível carregar seus favoritos agora.',
    (docs) => (
      <Container loading={false} unstylized className="container-full-width">
        <UsersList className="users list-flex-row">
          {docs.map((user) => (
            <UndoableUserCard
              key={user._id}
              user={user}
              endpoint={`/likes/devs/${user.user}`}
              successMessage={`${user.user} saiu de: Favoritos`}
              errorFallback="Erro ao desfazer favorito."
              kind="like"
            />
          ))}
        </UsersList>
      </Container>
    ),
  );
}
