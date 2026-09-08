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
    <div className='buttons'>
      {(!includedInDislike && !includedInLike) &&
        <>
          <button
            type='button'
            onClick={() => handleDislike()}
            disabled={pending}
            aria-label={`Marcar ${channelName} como não seguido`}
          >
            <MdSyncDisabled className="dislike" aria-hidden="true" />
          </button>

          <button
            type='button'
            onClick={() => handleLike()}
            disabled={pending}
            aria-label={`Favoritar ${channelName}`}
          >
            <MdStarBorder aria-hidden="true" />
          </button>
        </>
      }

      {includedInDislike &&
        <button type='button' onClick={() => handleUndoDislike()} disabled={pending}>
          <MdSyncDisabled className="dislike" aria-hidden="true" /><span>Desmarcar</span>
        </button>
      }

      {includedInLike &&
        <button type='button' onClick={() => handleUndoLike()} disabled={pending}>
          <MdStarBorder aria-hidden="true" /><span>Desmarcar</span>
        </button>
      }
    </div>
  );
}
