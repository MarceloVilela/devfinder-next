'use client';

import React, { useMemo } from 'react';
import { toast } from 'react-toastify';
import { MdSyncDisabled, MdStarBorder } from 'react-icons/md';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

interface ChannelLikeButtonsProps {
  channelId: string;
  channelName: string;
}

export default function ChannelLikeButtons({ channelId, channelName }: ChannelLikeButtonsProps) {
  const { user, setUser, isHydrated } = useAuth();

  const includedInLike = useMemo(() => {
    if (!isHydrated || !user) {
      return false
    }
    return user.follow.includes(channelId);
  }, [user, channelId, isHydrated])

  const includedInDislike = useMemo(() => {
    if (!isHydrated || !user) {
      return false
    }
    return user.ignore.includes(channelId);
  }, [user, channelId, isHydrated])

  async function handleUndoDislike() {
    if (!user) {
      toast.error('Acessando como visitante, não é possível desabilitar.');
      return;
    }

    try {
      const { data } = await api.delete(`/dislikes/channels/${channelName}`);
      toast.success(`${channelName} saiu de: Não seguidos`);
      setUser(data);
    } catch (error) {
      toast.error('Erro ao desabilitar.');
    }
  }

  async function handleUndoLike() {
    if (!user) {
      toast.error('Acessando como visitante, não é possível favoritar.');
      return;
    }

    try {
      const { data } = await api.delete(`/likes/channels/${channelName}`)
      toast.success(`${channelName} saiu de: Favoritos`);
      setUser(data);
    } catch (error) {
      toast.error('Erro ao favoritar.');
    }
  }

  async function handleDislike() {
    if (!user) {
      toast.error('Acessando como visitante, não é possível desabilitar.');
      return;
    }

    try {
      const { data } = await api.post(`/dislikes/channels/${channelName}`)
      toast.success(`${channelName} foi para: Não seguidos`);
      setUser(data);
    } catch (error) {
      toast.error('Erro ao desabilitar.');
    }
  }

  async function handleLike() {
    if (!user) {
      toast.error('Acessando como visitante, não é possível favoritar.');
      return;
    }

    try {
      const { data } = await api.post(`/likes/channels/${channelName}`)
      toast.success(`${channelName} foi para: Favoritos`);
      setUser(data);
    } catch (error) {
      toast.error('Erro ao favoritar.');
    }
  }

  return (
    <div className='buttons'>
      {(!includedInDislike && !includedInLike) &&
        <>
          <button type='button' onClick={() => handleDislike()}>
            <MdSyncDisabled className="dislike" />
          </button>

          <button type='button' onClick={() => handleLike()}>
            <MdStarBorder />
          </button>
        </>
      }

      {includedInDislike &&
        <button type='button' onClick={() => handleUndoDislike()}>
          <MdSyncDisabled className="dislike" /><span>Desmarcar</span>
        </button>
      }

      {includedInLike &&
        <button type='button' onClick={() => handleUndoLike()}>
          <MdStarBorder /><span>Desmarcar</span>
        </button>
      }
    </div>
  );
}
