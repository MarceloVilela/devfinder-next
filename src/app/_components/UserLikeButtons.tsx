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

  return (
    <>
      {(!includedInDislike && !includedInLike) &&
        <div className='buttons'>
          <button
            type='button'
            onClick={handleDislike}
            disabled={pending}
            aria-label={`Marcar ${username} como não seguido`}
          >
            <MdSyncDisabled className="dislike" aria-hidden="true" />
          </button>

          <button
            type='button'
            onClick={handleLike}
            disabled={pending}
            aria-label={`Favoritar ${username}`}
          >
            <MdStarBorder aria-hidden="true" />
          </button>
        </div>
      }

      {includedInDislike &&
        <div className='buttons single'>
          <button type='button' onClick={handleUndoDislike} disabled={pending}>
            <MdSyncDisabled className="dislike" aria-hidden="true" />Desmarcar
          </button>
        </div>
      }

      {includedInLike &&
        <div className='buttons single'>
          <button type='button' onClick={handleUndoLike} disabled={pending}>
            <MdStarBorder aria-hidden="true" />Desmarcar
          </button>
        </div>
      }
    </>
  );
}
