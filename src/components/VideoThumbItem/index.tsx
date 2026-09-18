import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { VideoData } from '../../types';
import { classNames } from '../../lib/classNames';
import { SKELETON_BAR_CLASSNAME, SKELETON_COLOR_CLASSNAME } from '../../lib/skeletonClassName';

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
          <li className="card rounded-[10px] cursor-default">
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="thumb flex justify-center items-center relative w-full aspect-[16/9]">
                {/* sem `sizes`: otimização de imagem está desligada globalmente
                   (next.config.js, images.unoptimized) — sem otimização não há srcset, então a
                   prop ficaria inerte. */}
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                />
              </div>
            </a>

            <footer className="container-edge-spacing flex flex-row justify-between flex-1 mt-4 text-left">
              <div className='avatar'>
                <Image
                  className="w-10 h-10 rounded-full mr-2 object-cover"
                  src={video.thumbnail}
                  alt={video.title}
                  width={40}
                  height={40}
                />
              </div>

              <div className='bio'>
              <Link href={`/video/${idYoutubeWatch}`}><strong className="block mb-2 text-[16px] leading-[16px] max-h-8 overflow-hidden text-foreground-stronger">{video.title}</strong></Link>
                <small className="block text-[14px] leading-[14px] max-h-7 overflow-hidden text-foreground-strong">{video.channel}</small>
              </div>
            </footer>
          </li>
        )
        : (
          <li className="placeholder card rounded-[10px] cursor-default">
            <div className={classNames('thumb flex justify-center items-center relative w-full aspect-[16/9] h-[174px]', SKELETON_COLOR_CLASSNAME)}>
            </div>

            <footer className="container-edge-spacing flex flex-row justify-between flex-1 mt-4 text-left">
              <div className={classNames('avatar w-10 h-10 rounded-full mr-2', SKELETON_COLOR_CLASSNAME)}>
              </div>

              <div className='bio flex flex-1 flex-col'>
                <p className={SKELETON_BAR_CLASSNAME}></p>
                <p className={SKELETON_BAR_CLASSNAME}></p>
              </div>
            </footer>

          </li>
        )}
    </>
  );
}

export default VideoThumbItem;
