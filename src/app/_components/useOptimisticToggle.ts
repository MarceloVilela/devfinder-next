'use client';

import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import api from '../../services/api';
import { useAuth, UserData } from '../../hooks/auth';

type ListField = 'likes' | 'deslikes' | 'follow' | 'ignore';
type Kind = 'like' | 'dislike';

const MESSAGES: Record<Kind, { error: string; guest: string }> = {
  like: {
    error: 'Erro ao favoritar.',
    guest: 'Acessando como visitante, não é possível favoritar.',
  },
  dislike: {
    error: 'Erro ao desabilitar.',
    guest: 'Acessando como visitante, não é possível desabilitar.',
  },
};

interface UseOptimisticToggleParams {
  entityId: string;
  entityLabel: string;
  // `resource`/`resourceName` montam a URL como `/{likes,dislikes}/{resource}/{resourceName}` —
  // padrão uniforme entre POST (marcar) e DELETE (desmarcar), verificado contra as rotas do
  // backend (devfinder-api/src/routes/index.ts).
  resource: 'channels' | 'devs';
  resourceName: string;
  likedField: ListField;
  dislikedField: ListField;
}

// Encapsula o padrão repetido em ChannelLikeButtons/UserLikeButtons: UI otimista, revert em
// falha, `pending` pra desabilitar os botões durante a request, resync com a resposta do
// servidor no sucesso.
export function useOptimisticToggle({
  entityId,
  entityLabel,
  resource,
  resourceName,
  likedField,
  dislikedField,
}: UseOptimisticToggleParams) {
  const { user, setUser, isHydrated } = useAuth();
  const [pending, setPending] = useState(false);

  const includedInLike = useMemo(() => {
    if (!isHydrated || !user || !user._id) {
      return false;
    }
    return user[likedField].includes(entityId);
  }, [user, entityId, isHydrated, likedField]);

  const includedInDislike = useMemo(() => {
    if (!isHydrated || !user || !user._id) {
      return false;
    }
    return user[dislikedField].includes(entityId);
  }, [user, entityId, isHydrated, dislikedField]);

  async function run(
    method: 'post' | 'delete',
    urlPrefix: 'likes' | 'dislikes',
    kind: Kind,
    successMessage: string,
    buildOptimisticUser: (currentUser: UserData) => UserData,
  ) {
    if (!user || !user._id) {
      toast.error(MESSAGES[kind].guest);
      return;
    }

    const previousUser = user;
    const url = `/${urlPrefix}/${resource}/${resourceName}`;
    setPending(true);
    setUser(buildOptimisticUser(user));

    try {
      const { data } = method === 'post' ? await api.post(url) : await api.delete(url);
      toast.success(successMessage);
      setUser(data);
    } catch (error) {
      setUser(previousUser);
      toast.error(MESSAGES[kind].error);
    } finally {
      setPending(false);
    }
  }

  const handleLike = () => run(
    'post',
    'likes',
    'like',
    `${entityLabel} foi para: Favoritos`,
    (currentUser) => ({ ...currentUser, [likedField]: [...currentUser[likedField], entityId] }),
  );

  const handleUndoLike = () => run(
    'delete',
    'likes',
    'like',
    `${entityLabel} saiu de: Favoritos`,
    (currentUser) => ({ ...currentUser, [likedField]: currentUser[likedField].filter((id) => id !== entityId) }),
  );

  const handleDislike = () => run(
    'post',
    'dislikes',
    'dislike',
    `${entityLabel} foi para: Não seguidos`,
    (currentUser) => ({ ...currentUser, [dislikedField]: [...currentUser[dislikedField], entityId] }),
  );

  const handleUndoDislike = () => run(
    'delete',
    'dislikes',
    'dislike',
    `${entityLabel} saiu de: Não seguidos`,
    (currentUser) => ({ ...currentUser, [dislikedField]: currentUser[dislikedField].filter((id) => id !== entityId) }),
  );

  return {
    pending,
    includedInLike,
    includedInDislike,
    handleLike,
    handleUndoLike,
    handleDislike,
    handleUndoDislike,
  };
}
