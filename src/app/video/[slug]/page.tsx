import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { FaYoutube, FaHome } from 'react-icons/fa';

import { fetchDetail } from '../../../lib/fetchDetail';
import { classNames } from '../../../lib/classNames';
import { DETAIL_ACTION_BUTTON_CLASSNAME } from '../../../lib/detailActionButtonClassName';
import { Container } from '../../../components';
import { VideoData } from '../../../types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Ausência de vídeo (não 404 real, 200 + `null`) vs. erro de rede: ver `lib/fetchDetail.ts`.
async function getVideo(idYoutubeWatch: string): Promise<VideoData | null> {
  return fetchDetail<VideoData>(`/video/${idYoutubeWatch}`);
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
              className={DETAIL_ACTION_BUTTON_CLASSNAME}
            >
              <span className="flex-1 text-left ml-6 uppercase font-bold">Acessar</span>
              <FaYoutube className="text-2xl text-white mx-4 w-8" />
            </button>
          </a>

          <a
            href={'/'}
            rel="noopener noreferrer"
          >
            <button className={classNames(DETAIL_ACTION_BUTTON_CLASSNAME, 'bg-primary-stronger')}>
              <span className="flex-1 text-left ml-6 uppercase font-bold">Listar outros</span>
              <FaHome className="text-2xl text-white mx-4 w-8" />
            </button>
          </a>
        </div>
      </article>
    </Container>
  );
}
