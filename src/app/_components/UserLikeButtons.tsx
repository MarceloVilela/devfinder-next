'use client';

import React from 'react';
import { toast } from 'react-toastify';
import { MdSyncDisabled, MdStarBorder } from 'react-icons/md';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

interface UserLikeButtonsProps {
  username: string;
}

export default function UserLikeButtons({ username }: UserLikeButtonsProps) {
  const { user } = useAuth();

  async function handleDislike() {
    if (!user) {
      toast.error('Acessando como visitante, não é possível desabilitar.');
      return;
    }

    try {
      await api.post(`/dislikes/devs/${username}`);
      toast.success(`${username} foi para: Não seguidos`);
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
      await api.post(`/likes/devs/${username}`);
      toast.success(`${username} foi para: Favoritos`);
    } catch (error) {
      toast.error('Erro ao favoritar.');
    }
  }

  return (
    <div className='buttons'>
      <button type='button' onClick={handleDislike}>
        <MdSyncDisabled className="dislike" />
      </button>

      <button type='button' onClick={handleLike}>
        <MdStarBorder />
      </button>
    </div>
  );
}
