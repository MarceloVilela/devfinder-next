'use client';

import React from 'react';
import { MdSyncDisabled, MdStarBorder } from 'react-icons/md';

import { useOptimisticToggle } from './useOptimisticToggle';

interface UserLikeButtonsProps {
  userId: string;
  username: string;
}

export default function UserLikeButtons({ userId, username }: UserLikeButtonsProps) {
  const {
    containerRef,
    pending,
    includedInLike,
    includedInDislike,
    handleLike,
    handleUndoLike,
    handleDislike,
    handleUndoDislike,
  } = useOptimisticToggle({
    entityId: userId,
    entityLabel: username,
    resource: 'devs',
    resourceName: username,
    likedField: 'likes',
    dislikedField: 'deslikes',
  });

  const marked = includedInDislike || includedInLike;

  // Um único contêiner (classe alternada) em vez de um `<div>` por estado: o `containerRef` do hook
  // precisa sobreviver à troca de botões pra devolver o foco depois da ação.
  return (
    <div ref={containerRef} className={marked ? 'buttons single' : 'buttons'}>
      {!marked &&
        <>
          <button
            type='button'
            onClick={handleDislike}
            disabled={pending}
            data-kind='dislike'
            aria-label={`Marcar ${username} como não seguido`}
          >
            <MdSyncDisabled className="dislike" aria-hidden="true" />
          </button>

          <button
            type='button'
            onClick={handleLike}
            disabled={pending}
            data-kind='like'
            aria-label={`Favoritar ${username}`}
          >
            <MdStarBorder aria-hidden="true" />
          </button>
        </>
      }

      {includedInDislike &&
        <button
          type='button'
          onClick={handleUndoDislike}
          disabled={pending}
          data-kind='dislike'
          aria-label={`Desmarcar ${username} como não seguido`}
        >
          <MdSyncDisabled className="dislike" aria-hidden="true" />Desmarcar
        </button>
      }

      {includedInLike &&
        <button
          type='button'
          onClick={handleUndoLike}
          disabled={pending}
          data-kind='like'
          aria-label={`Desmarcar favorito ${username}`}
        >
          <MdStarBorder aria-hidden="true" />Desmarcar
        </button>
      }
    </div>
  );
}
