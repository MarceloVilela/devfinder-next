import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

import api from '../../services/api'
import { Paginate, VideoThumbItem, Container } from '../../components'
import { VideoData } from './index'
import { VideoList } from './style'
//import { delay } from '../../utils'

export interface TrendProps {
  docsStatic: VideoData[];
  totalStatic: number;
  itemsPerPageStatic: number;
}

const Trend = ({ docsStatic, totalStatic, itemsPerPageStatic }: TrendProps) => {
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState<VideoData[]>([] as VideoData[])
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setDocs(docsStatic);
    setTotal(totalStatic);
    setItemsPerPage(itemsPerPageStatic);
  }, [docsStatic, itemsPerPageStatic, totalStatic])

  useEffect(() => {
    async function loadDocs() {
      try {
        if (page != 1) {
          setLoading(true)
          setDocs(Array.from(Array(30)).map(item => ({} as VideoData)))
        }

        const userIdentifier = router.query.user ? { user: router.query.user } : {};

        const { data } = await api.get('/feed/trending', { params: { page, ...userIdentifier } })
        setDocs(data.docs)
        setTotal(data.total);
        setItemsPerPage(data.itemsPerPage);
      } catch (error) {
        toast.error('Erro ao listar feed')
      } finally {
        setLoading(false)
      }
    }
    loadDocs()
  }, [page, router])

  return (
    <Container loading={false} unstylized className='container-full-width'>
      <>

        <VideoList className="subs list-flex-column">
          {docs?.map((item, key) => (
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

export default Trend;