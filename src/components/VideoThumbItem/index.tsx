import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { VideoData } from '../../types';
import { Thumb } from './style';

interface ItemProps {
  video: VideoData;
  placeholder?: boolean;
}

const VideoThumbItem: React.FC<ItemProps> = ({ video, placeholder = false }) => {
  const idYoutubeWatch = video.url ? video.url.split('v=')[1] : '';

  return (
    <>
      {!placeholder
        ? (
          <Thumb className="card">
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="thumb">
                {/* unoptimized: thumb do YouTube já vem pré-dimensionada da fonte; fill+sizes aqui
                   multiplicava srcset e estourou a cota de Image Optimization via crawler — ver
                   vercel-image-optimization-quota.md. `sizes` removido: sem otimização não há
                   srcset, então a prop ficaria inerte. */}
                <Image
                  unoptimized
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                />
              </div>
            </a>

            <footer className='container-edge-spacing'>
              <div className='avatar'>
                {/* unoptimized: mesma URL-fonte do thumb acima (video.thumbnail) — sem isso, essa
                   segunda transformação continua consumindo a mesma cota que o fix acima quis
                   zerar. Achado no code-review da etapa 1. */}
                <Image
                  unoptimized
                  src={video.thumbnail}
                  alt={video.title}
                  width={40}
                  height={40}
                />
              </div>

              <div className='bio'>
              <Link href={`/video/${idYoutubeWatch}`}><strong>{video.title}</strong></Link>
                <small>{video.channel}</small>
              </div>
            </footer>
          </Thumb>
        )
        : (
          <Thumb className="placeholder card">
            <div className="thumb">
            </div>

            <footer className='container-edge-spacing'>
              <div className='avatar'>
              </div>

              <div className='bio'>
                <p></p>
                <p></p>
              </div>
            </footer>

          </Thumb>
        )}
    </>
  );
}

export default VideoThumbItem;
