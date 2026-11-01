'use client';

import { UserData } from '../../types';
import { useState, type MouseEvent } from 'react';
import { toast } from 'react-toastify';
import { MdStarBorder, MdSyncDisabled } from 'react-icons/md';

import api from '../../services/api';
import { UserItem } from '../../components';
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

  async function handleUndo(event: MouseEvent<HTMLButtonElement>) {
    // Guardado antes do `await`: depois do undo o card some e o foco cairia no `body`.
    const card = event.currentTarget.closest('li');
    setPending(true);

    try {
      await api.delete(endpoint);
      toast.success(successMessage);
      // Foco previsível (a11y, achado M4 v5): vai pro botão de ação do próximo card da lista (ou do
      // anterior, se este era o último) antes de remover este — não pro link do avatar, que abre o
      // GitHub em outra aba. Só se o foco ainda está neste card ou foi perdido (`body`): se o usuário
      // já foi pra outro lugar durante a request, não rouba. Sem vizinho, o foco cai no `body` — a
      // lista ficou vazia e o toast (`role="alert"`) anuncia o resultado.
      const active = document.activeElement;
      const focusIsHere = !active || active === document.body || Boolean(card?.contains(active));
      if (focusIsHere) {
        const neighbor = card?.nextElementSibling ?? card?.previousElementSibling;
        const target = neighbor?.querySelector<HTMLElement>('.buttons button') ?? neighbor?.querySelector<HTMLElement>('a, button');
        target?.focus();
      }
      setRemoved(true);
    } catch (error) {
      toast.error(getErrorMessage(error, errorFallback));
    } finally {
      setPending(false);
    }
  }

  const Icon = kind === 'like' ? MdStarBorder : MdSyncDisabled;

  return (
    <UserItem user={user}>
      <div className="buttons single">
        <button
          type="button"
          onClick={handleUndo}
          disabled={pending}
          aria-label={kind === 'like' ? `Desmarcar favorito ${user.user}` : `Desmarcar ${user.user} como não seguido`}
        >
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
