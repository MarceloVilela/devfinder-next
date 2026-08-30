import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { FaYoutube, FaHome } from 'react-icons/fa';

import { fetchJSON } from '../../../lib/fetchJSON';
import { Header, Container, Footer } from '../../../components';
import { VideoData } from '../../../types';
import About from './style';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// A API devolve 200 + corpo `null` quando o vídeo não existe (não 404) — fetchJSON já repassa
// esse `null` naturalmente. Sem try/catch aqui: erro de rede real (API fora do ar) sobe pro
// error.tsx em vez de virar "não encontrado" — só ausência de dado vira notFound().
async function getVideo(idYoutubeWatch: string): Promise<VideoData | null> {
  return fetchJSON<VideoData | null>(`/video/${idYoutubeWatch}`, { cache: 'no-store' });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideo(slug);

  if (!video) {
    return { title: 'Vídeo não encontrado' };
  }

  return { title: `Vídeo ${video.title}` };
}

export default async function VideoDetail({ params }: PageProps) {
  const { slug } = await params;
  const video = await getVideo(slug);

  if (!video) {
    notFound();
  }

  return (
    <>
      <Header />

      <Container loading={false} className="containerVerticalCenter">
        <About>
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
      </Container>

      <Footer />
    </>
  );
}
