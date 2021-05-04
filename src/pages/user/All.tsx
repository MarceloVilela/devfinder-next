import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { MdSyncDisabled, MdStarBorder } from 'react-icons/md'

import api from '../../services/api'
//import { delay } from '../../utils'
import { useAuth, UserData } from '../../hooks/auth'
import { Container, UserItem, Paginate } from '../../components'
import UsersList from './style'

export interface UserAllProps {
  docsStatic: UserData[];
  totalStatic: number;
  itemsPerPageStatic: number;
}

function All({ docsStatic, totalStatic, itemsPerPageStatic }: UserAllProps) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState<UserData[]>([] as UserData[])
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(0);

  useEffect(() => {
    setDocs(docsStatic);
    setTotal(totalStatic);
    setItemsPerPage(itemsPerPageStatic);
  }, [])

  useEffect(() => {
    async function loaddocs() {
      try {
        if (page != 1) {
          setLoading(true)
          setDocs(Array.from(Array(50)).map(item => ({} as UserData)))
        }

        //await delay(10 * 60 * 1000);

        const { data } = await api.get('/devs', { params: { page } })
        setDocs(data.docs)
        setTotal(data.total);
        setItemsPerPage(data.itemsPerPage);
      } catch (error) {
        toast.error('Erro ao listar devs')
      } finally {
        setLoading(false)
      }
    }
    loaddocs()
  }, [page])

  async function handleDislike(username: string) {
    if (!user) {
      toast.error('Acessando como visitante, não é possível desabilitar.');
      return;
    }

    await api.post(`/dislikes/devs/${username}`)
    toast.success(`${username} foi para: Não seguidos`);
    setDocs(docs.filter(user => user.user !== username))
  }

  async function handleLike(username: string) {
    if (!user) {
      toast.error('Acessando como visitante, não é possível favoritar.');
      return;
    }

    await api.post(`/likes/devs/${username}`)
    toast.success(`${username} foi para: Favoritos`);
    setDocs(docs.filter(user => user.user !== username))
  }

  return (
    <Container loading={false} unstylized className="container-full-width">

      <UsersList className="users list-flex-row">
        {docs.map((user, key) => (
          <UserItem key={key} user={user} placeholder={loading}>
            <div className='buttons'>
              <button type='button' onClick={() => handleDislike(user.user)}>
                <MdSyncDisabled className="dislike" />
              </button>

              <button type='button' onClick={() => handleLike(user.user)}>
                <MdStarBorder />
              </button>
            </div>
          </UserItem>
        ))}
      </UsersList>
      {!loading &&
        <Paginate page={page} totalItems={total} itemsPerPage={itemsPerPage} handlePaginate={setPage} />
      }
    </Container>
  )
}

export default All;