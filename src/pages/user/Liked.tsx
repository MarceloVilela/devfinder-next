import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { MdStarBorder } from 'react-icons/md'

import api from '../../services/api'
import { useAuth, UserData } from '../../hooks/auth'
import { Container, UserItem } from '../../components'
import UsersList from './style'

function Liked() {
  const { user } = useAuth();

  const [docs, setDocs] = useState<UserData[]>([] as UserData[])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loaddocs() {
      try {
        setLoading(true)
        setDocs(Array.from(Array(50)).map(item => ({} as UserData)))

        const { data } = await api.get('/likes/devs')
        setDocs(data)
      } catch (error) {
        toast.error('Erro ao listar devs')
      } finally {
        setLoading(false)
      }
    }
    loaddocs()
  }, [])

  async function handleUndoLike(username: string) {
    if (!user) {
      toast.error('Acessando como visitante, não é possível favoritar.');
      return;
    }

    await api.delete(`/devs/${username}/likes`)
    toast.success(`${username} saiu de: Favoritos`);
    setDocs(docs.filter(user => user.user !== username))
  }

  return (
    <Container loading={false} unstylized className="container-full-width">
      <UsersList className="users list-flex-row">
        {docs.map((user, key) => (
          <UserItem key={key} user={user} placeholder={loading}>
            <div className='buttons single'>
              <button type='button' onClick={() => handleUndoLike(user.user)}>
                <MdStarBorder className="dislike" />Desmarcar
              </button>
            </div>
          </UserItem>
        ))}
      </UsersList>
    </Container>
  )
}

export default Liked;