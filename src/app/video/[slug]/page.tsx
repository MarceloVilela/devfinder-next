import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { FaYoutube, FaHome } from 'react-icons/fa';

import { fetchJSON } from '../../../lib/fetchJSON';
import { Container } from '../../../components';
import { VideoData } from '../../../types';

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
    <Container loading={false} className="containerVerticalCenter">
      <article className="flex flex-col w-full items-center mx-auto">
        <Image
          className="border-0 rounded-2xl w-[270px] h-auto mb-6"
          src={video.thumbnail}
          alt={video.title}
          width={480}
          height={360}
        />

        <p className="text-foreground-stronger w-[270px] mb-6">{video.title}</p>

        <div className="flex flex-col justify-between">
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              style={{ backgroundColor: "#ff0000" }}
              className="h-[50px] shadow-[0_2px_2px_0_rgba(0,0,0,0.05)] border-0 rounded-[4px] cursor-pointer text-white flex items-center justify-center w-[270px] mb-6"
            >
              <span className="flex-1 text-left ml-6 uppercase font-bold">Acessar</span>
              <FaYoutube className="text-2xl text-white mx-4 w-8" />
            </button>
          </a>

          <a
            href={'/'}
            rel="noopener noreferrer"
          >
            <button className="h-[50px] shadow-[0_2px_2px_0_rgba(0,0,0,0.05)] border-0 rounded-[4px] bg-primary-stronger cursor-pointer text-white flex items-center justify-center w-[270px] mb-6">
              <span className="flex-1 text-left ml-6 uppercase font-bold">Listar outros</span>
              <FaHome className="text-2xl text-white mx-4 w-8" />
            </button>
          </a>
        </div>
      </article>
    </Container>
  );
}
