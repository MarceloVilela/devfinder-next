'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import api from '../../services/api';
import { UserData } from '../../hooks/auth';
import { getErrorMessage, makePlaceholders } from '../../utils';

interface UseUndoListParams {
  listUrl: string;
  buildUndoUrl: (username: string) => string;
  isLoggedIn: boolean;
  guestMessage: string;
  buildSuccessMessage: (username: string) => string;
  errorFallback: string;
}

// Encapsula o padrão repetido em UserLiked/UserDisliked: carrega a lista, remove um item
// otimisticamente após confirmação do DELETE, com try/catch pra falha de rede não ficar
// silenciosa (achado H3, etapa 1 v3) e o mesmo guard de visitante usado em
// useOptimisticToggle (achado no code-review da etapa 2 v3 — aqui checava só `!user`, que
// nunca dispara porque `user` anônimo é `{}`, truthy; na prática inofensivo porque UserTabs já
// só renderiza estas telas logado, mas corrigido pra não depender dessa garantia externa).
export function useUndoList({
  listUrl,
  buildUndoUrl,
  isLoggedIn,
  guestMessage,
  buildSuccessMessage,
  errorFallback,
}: UseUndoListParams) {
  const [docs, setDocs] = useState<UserData[]>([] as UserData[]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDocs() {
      try {
        setLoading(true);
        setDocs(makePlaceholders<UserData>(50));

        const { data } = await api.get(listUrl);
        setDocs(data);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Não encontrado.'));
      } finally {
        setLoading(false);
      }
    }
    loadDocs();
  }, [listUrl]);

  async function handleUndo(username: string) {
    if (!isLoggedIn) {
      toast.error(guestMessage);
      return;
    }

    try {
      await api.delete(buildUndoUrl(username));
      toast.success(buildSuccessMessage(username));
      setDocs((current) => current.filter((item) => item.user !== username));
    } catch (error) {
      toast.error(getErrorMessage(error, errorFallback));
    }
  }

  return { docs, loading, handleUndo };
}
