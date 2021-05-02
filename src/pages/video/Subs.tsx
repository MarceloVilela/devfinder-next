import React, { useEffect, useState } from 'react'
//import { toast } from 'react-toastify'

import api from '../../services/api'
import { useAuth } from '../../hooks/auth';
import { Paginate, VideoThumbItem, Container } from '../../components'
import { VideoData } from './index'
import { VideoList } from './style'

const Subs = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false)
  const [docs, setDocs] = useState<VideoData[]>([] as VideoData[])
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(0);

  useEffect(() => {
    if (!user) {
      //toast.warn('Acesse através de login social para listar videos das inscrições.')
      return;
    }

    async function loadDocs() {
      try {
        setLoading(true)
        setDocs(Array.from(Array(30)).map(item => ({} as VideoData)))

        const { data } = await api.get('/feed/subscriptions', { params: { page } })
        setDocs(data.docs)
        setTotal(data.total);
        setItemsPerPage(data.itemsPerPage);
      } catch (error) {
        //toast.error('Erro ao listar feed')
      } finally {
        setLoading(false)
      }
    }
    loadDocs()
  }, [page, user])

  return (
    <Container loading={false} unstylized className='container-full-width'>
      <>

        <VideoList className="subs list-flex-column">
          {docs.map((item, key) => (
            <VideoThumbItem key={key} video={item} placeholder={loading} />
          ))}
        </VideoList>
        {!loading &&
          <Paginate page={page} totalItems={total} itemsPerPage={itemsPerPage} handlePaginate={setPage} />
        }

      </>
    </Container>
  )
}

export default Subs;