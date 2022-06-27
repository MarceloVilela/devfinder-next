import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FaYoutube, FaHome } from 'react-icons/fa';
import { toast } from 'react-toastify';

import api from '../../services/api'
import { Header, Container, Footer } from '../../components'
import { VideoData } from './index'
import About from './VideoDetailStyle'

interface VideoDetailProps {
  match: {
    params: {
      id: string;
    }
  }
}

const VideoDetail: React.FC<VideoDetailProps> = ({ match }) => {
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
        toast.error(`Erro ao listar detalhes do vídeo: ${idYoutubeWatch}`);
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
            <img
              className="thumb"
              src={video.thumbnail}
              alt={video.title}       
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