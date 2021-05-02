import React from 'react';

import { VideoData } from '../../pages/Main'
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
                <img
                  src={video.thumbnail}
                  alt={video.title}
                />
              </div>
            </a>

            <footer className='container-edge-spacing'>
              <div className='avatar'>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                />
              </div>

              <div className='bio'>
              <a href={`/video/${idYoutubeWatch}`}><strong>{video.title}</strong></a>
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
