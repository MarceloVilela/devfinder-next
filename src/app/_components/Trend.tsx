import React from 'react';

import { Paginate, VideoThumbItem, Container } from '../../components';
import { VideoData } from '../../types';
import { VideoList } from '../video/style';

export interface TrendProps {
  docsStatic: VideoData[];
  totalStatic: number;
  itemsPerPageStatic: number;
  page: number;
}

const Trend = ({ docsStatic, totalStatic, itemsPerPageStatic, page }: TrendProps) => {
  return (
    <Container loading={false} unstylized className='container-full-width'>
      <>
        <VideoList className="subs list-flex-column">
          {docsStatic.map((item) => (
            <VideoThumbItem key={item._id} video={item} />
          ))}
        </VideoList>
        <Paginate page={page} totalItems={totalStatic} itemsPerPage={itemsPerPageStatic} />
      </>
    </Container>
  )
}

export default Trend;
