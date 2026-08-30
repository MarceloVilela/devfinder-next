import React from 'react';

import { Paginate, VideoThumbItem } from '../../components';
import { VideoData } from '../../types';
import { VideoList } from '../video/style';

interface ChannelVideoFeedProps {
  docsStatic: VideoData[];
  totalStatic: number;
  itemsPerPageStatic: number;
  page: number;
}

export default function ChannelVideoFeed({ docsStatic, totalStatic, itemsPerPageStatic, page }: ChannelVideoFeedProps) {
  return (
    <>
      <VideoList className="subs list-flex-column">
        {docsStatic.map((item) => (
          <VideoThumbItem key={item._id} video={item} />
        ))}
      </VideoList>
      <Paginate page={page} totalItems={totalStatic} itemsPerPage={itemsPerPageStatic} />
    </>
  );
}
