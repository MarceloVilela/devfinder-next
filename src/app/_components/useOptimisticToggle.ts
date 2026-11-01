'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import { UserData } from '../../types';

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

  // Foco previsível depois da ação (a11y, achado M4 v5): o botão clicado é desmontado e substituído
  // por outro conforme o estado muda, e o navegador devolve o foco ao `body` quando o elemento
  // focado some — quem usa teclado perde o ponto em que estava. Depois que a request termina (com
  // `pending` ainda true os botões estão `disabled` e não recebem foco), o foco vai pro botão do
  // mesmo `kind` da ação (`data-kind` nos botões): "Desmarcar" depois de marcar, "Favoritar" depois
  // de desmarcar favorito. Só age se o foco foi PERDIDO (`body`/`null`, ou o próprio contêiner) — se o
  // usuário já tabulou pra outro elemento durante a request (cold start leva 30-60s), não rouba o foco.
  const containerRef = useRef<HTMLDivElement>(null);
  const restoreFocusKind = useRef<Kind | null>(null);

  useEffect(() => {
    const kind = restoreFocusKind.current;
    const container = containerRef.current;
    if (pending || !kind || !container) {
      return;
    }
    restoreFocusKind.current = null;
    const active = document.activeElement;
    const focusLost = !active || active === document.body || active === container;
    if (focusLost) {
      container.querySelector<HTMLButtonElement>(`button[data-kind="${kind}"]`)?.focus();
    }
  }, [pending, includedInLike, includedInDislike]);

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
    restoreFocusKind.current = kind;
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
    containerRef,
    pending,
    includedInLike,
    includedInDislike,
    handleLike,
    handleUndoLike,
    handleDislike,
    handleUndoDislike,
  };
}
