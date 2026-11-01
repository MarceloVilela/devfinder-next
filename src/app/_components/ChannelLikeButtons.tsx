'use client';

import React from 'react';
import { MdSyncDisabled, MdStarBorder } from 'react-icons/md';

import { useOptimisticToggle } from './useOptimisticToggle';

interface ChannelLikeButtonsProps {
  channelId: string;
  channelName: string;
}

export default function ChannelLikeButtons({ channelId, channelName }: ChannelLikeButtonsProps) {
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
    entityId: channelId,
    entityLabel: channelName,
    resource: 'channels',
    resourceName: channelName,
    likedField: 'follow',
    dislikedField: 'ignore',
  });

  return (
    <div ref={containerRef} className='buttons'>
      {(!includedInDislike && !includedInLike) &&
        <>
          <button
            type='button'
            onClick={() => handleDislike()}
            disabled={pending}
            data-kind='dislike'
            aria-label={`Marcar ${channelName} como não seguido`}
          >
            <MdSyncDisabled className="dislike" aria-hidden="true" />
          </button>

          <button
            type='button'
            onClick={() => handleLike()}
            disabled={pending}
            data-kind='like'
            aria-label={`Favoritar ${channelName}`}
          >
            <MdStarBorder aria-hidden="true" />
          </button>
        </>
      }

      {includedInDislike &&
        <button
          type='button'
          onClick={() => handleUndoDislike()}
          disabled={pending}
          data-kind='dislike'
          aria-label={`Desmarcar ${channelName} como não seguido`}
        >
          <MdSyncDisabled className="dislike" aria-hidden="true" /><span>Desmarcar</span>
        </button>
      }

      {includedInLike &&
        <button
          type='button'
          onClick={() => handleUndoLike()}
          disabled={pending}
          data-kind='like'
          aria-label={`Desmarcar favorito ${channelName}`}
        >
          <MdStarBorder aria-hidden="true" /><span>Desmarcar</span>
        </button>
      }
    </div>
  );
}
