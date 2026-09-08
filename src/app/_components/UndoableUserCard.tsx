'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { MdStarBorder, MdSyncDisabled } from 'react-icons/md';

import api from '../../services/api';
import { UserItem } from '../../components';
import { UserData } from '../../hooks/auth';
import { getErrorMessage } from '../../utils';

interface UndoableUserCardProps {
  user: UserData;
  endpoint: string;
  successMessage: string;
  errorFallback: string;
  kind: 'like' | 'dislike';
}

// Client Component-folha (achado 6, etapa 2 v3): UserLiked/UserDisliked (pai, Server
// Component) não têm estado pra remover o item da lista depois do undo — só o botão de
// "Desmarcar" precisa ser interativo, então só ele (com o card em volta) é client. Some
// visualmente sozinho (useState local), sem re-buscar a lista inteira do servidor.
export function UndoableUserCard({ user, endpoint, successMessage, errorFallback, kind }: UndoableUserCardProps) {
  const [removed, setRemoved] = useState(false);
  const [pending, setPending] = useState(false);

  if (removed) {
    return null;
  }

  async function handleUndo() {
    setPending(true);

    try {
      await api.delete(endpoint);
      toast.success(successMessage);
      setRemoved(true);
    } catch (error) {
      toast.error(getErrorMessage(error, errorFallback));
    } finally {
      setPending(false);
    }
  }

  const Icon = kind === 'like' ? MdStarBorder : MdSyncDisabled;

  return (
    <UserItem user={user} placeholder={false}>
      <div className="buttons single">
        <button type="button" onClick={handleUndo} disabled={pending}>
          {/* className="dislike" no ícone de "like" é comportamento original preservado
             (UserLiked.tsx pré-M1) — dita a direção da animação de hover em style.ts, não tem
             relação com o kind desta ação. Achado no code-review da migração: minha primeira
             versão tinha isso invertido. */}
          <Icon className={kind === 'like' ? 'dislike' : undefined} aria-hidden="true" />Desmarcar
        </button>
      </div>
    </UserItem>
  );
}
