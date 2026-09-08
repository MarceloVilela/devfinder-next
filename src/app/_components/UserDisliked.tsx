import { CardSkeleton, Container, UserItem } from '../../components';
import UsersList from '../user/style';
import { UserData } from '../../hooks/auth';
import { fetchSessionJSON } from '../../lib/fetchSessionJSON';
import { UndoableUserCard } from './UndoableUserCard';
import { resolveSessionSection } from './sessionFetch';
import { makePlaceholders } from '../../utils';

interface UserDislikedProps {
  token: string;
}

// Server Component (M1, etapa 2 v3) — ver comentário equivalente em UserLiked.tsx.
export default async function UserDisliked({ token }: UserDislikedProps) {
  return resolveSessionSection(
    () => fetchSessionJSON<UserData[]>('/dislikes/devs', token),
    'Não foi possível carregar sua lista de não seguidos agora.',
    (docs) => (
      <Container loading={false} unstylized className="container-full-width">
        <UsersList className="users list-flex-row">
          {docs.map((user) => (
            <UndoableUserCard
              key={user._id}
              user={user}
              endpoint={`/dislikes/devs/${user.user}`}
              successMessage={`${user.user} saiu de: Não seguidos`}
              errorFallback="Erro ao desfazer."
              kind="dislike"
            />
          ))}
        </UsersList>
      </Container>
    ),
  );
}

export function UserDislikedSkeleton() {
  return (
    <Container loading={false} unstylized className="container-full-width">
      <CardSkeleton loading loadingLabel="Carregando não seguidos...">
        <UsersList className="users list-flex-row">
          {makePlaceholders<UserData>(50).map((user, key) => (
            <UserItem key={key} user={user} placeholder />
          ))}
        </UsersList>
      </CardSkeleton>
    </Container>
  );
}
