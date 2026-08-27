import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { FaYoutube, FaHome } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

import api from '../../services/api'
import { Header, Container, Footer } from '../../components'
import { VideoData } from './index'
import About from './VideoDetailStyle'
import { getErrorMessage } from '../../utils'

const VideoDetail: React.FC = () => {
  const router = useRouter();

  const [video, setVideo] = useState({} as VideoData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadvideos() {
      const { slug: idYoutubeWatch } = router.query;

      if (!idYoutubeWatch) {
        return;
      }

      try {
        setLoading(true)

        const { data } = await api.get(`/video/${idYoutubeWatch}`);

        if (!data) {
          toast.error(`Ops! Vídeo ${idYoutubeWatch} não encontrado.`);
          router.push('/');
        }

        setVideo(data);
      } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 401) {
          toast.error(getErrorMessage(error, `Vídeo ${idYoutubeWatch} não encontrado.`), {
            autoClose: false,
            closeOnClick: false,
          });
        }
      } finally {
        setLoading(false);
      }

    }
    loadvideos()
  }, [router])

  return (
    <>
      <Header />

      <Container loading={loading} className="containerVerticalCenter">

        {(video && '_id' in video) && (
          <About>
            <Head><title>Vídeo {video.title} | {process.env.NEXT_PUBLIC_TITLE}</title></Head>
            <Image
              className="thumb"
              src={video.thumbnail}
              alt={video.title}
              width={480}
              height={360}
              style={{ width: '270px', height: 'auto' }}
            />

            <p>{video.title}</p>

            <div className="buttons">
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button style={{ backgroundColor: "#ff0000" }}>
                  <span>Acessar</span>
                  <FaYoutube />
                </button>
              </a>

              <a
                href={'/'}
                rel="noopener noreferrer"
              >
                <button>
                  <span>Listar outros</span>
                  <FaHome />
                </button>
              </a>
            </div>
          </About>
        )}
      </Container>

      <Footer />
    </>
  )
}

export default VideoDetail;