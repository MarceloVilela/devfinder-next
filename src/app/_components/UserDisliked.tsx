import { Container } from '../../components';
import UsersList from '../user/style';
import { UserData } from '../../hooks/auth';
import { fetchSessionJSON } from '../../lib/fetchSessionJSON';
import { UndoableUserCard } from './UndoableUserCard';
import { resolveSessionSection } from './sessionFetch';

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
