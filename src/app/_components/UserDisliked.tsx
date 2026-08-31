'use client';

import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { MdSyncDisabled } from 'react-icons/md'

import api from '../../services/api'
import { useAuth, UserData } from '../../hooks/auth'
import { CardSkeleton, Container, UserItem } from '../../components'
import UsersList from '../user/style'
import { getErrorMessage, makePlaceholders } from '../../utils'

function UserDisliked() {
  const { user } = useAuth();

  const [docs, setDocs] = useState<UserData[]>([] as UserData[])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loaddocs() {
      try {
        setLoading(true)
        setDocs(makePlaceholders<UserData>(50))

        const { data } = await api.get('/dislikes/devs')
        setDocs(data)
      } catch (error) {
        toast.error(getErrorMessage(error, 'Não encontrado.'))
      } finally {
        setLoading(false)
      }
    }
    loaddocs()
  }, [])

  async function handleUndoDislike(username: string) {
    if (!user) {
      toast.error('Acessando como visitante, não é possível desabilitar.');
      return;
    }

    await api.delete(`/dislikes/devs/${username}`)
    toast.success(`${username} saiu de: Não seguidos`);
    setDocs(docs.filter(user => user.user !== username))
  }

  return (
    <Container loading={false} unstylized className="container-full-width">
      <CardSkeleton loading={loading} loadingLabel="Carregando não seguidos...">
        <UsersList className="users list-flex-row">
          {docs.map((user, key) => (
            <UserItem key={key} user={user} placeholder={loading}>
              <div className='buttons single'>
                <button type='button' onClick={() => handleUndoDislike(user.user)}>
                  <MdSyncDisabled aria-hidden="true" />Desmarcar
                </button>
              </div>
            </UserItem>
          ))}
        </UsersList>
      </CardSkeleton>
    </Container>
  )
}

export default UserDisliked;
