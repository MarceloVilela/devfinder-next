import { CardSkeleton, Container, UserItem } from '../../components';
import UsersList from '../user/style';
import { UserData } from '../../hooks/auth';
import { fetchSessionJSON } from '../../lib/fetchSessionJSON';
import { UndoableUserCard } from './UndoableUserCard';
import { resolveSessionSection } from './sessionFetch';
import { makePlaceholders } from '../../utils';

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

// Placeholder de loading usado pelo Suspense fallback em user/page.tsx — mesmo visual que a
// versão CSR anterior mostrava via CardSkeleton, só que agora fora do componente que busca
// dado (Server Component não tem estado de loading próprio, o fallback é externo).
export function UserLikedSkeleton() {
  return (
    <Container loading={false} unstylized className="container-full-width">
      <CardSkeleton loading loadingLabel="Carregando favoritos...">
        <UsersList className="users list-flex-row">
          {makePlaceholders<UserData>(50).map((user, key) => (
            <UserItem key={key} user={user} placeholder />
          ))}
        </UsersList>
      </CardSkeleton>
    </Container>
  );
}
