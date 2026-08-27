import React, { ReactNode } from 'react';
import Image from 'next/image';

import Main from './style';

interface ContainerProps {
  children: ReactNode;
  loading: boolean;
  className?: string;
  unstylized?: boolean;
}

const Container: React.FC<ContainerProps> = ({ children, loading, className, unstylized }) => {
  return (
    <Main className={`${unstylized ? '' : 'container'} ${className}`}>
      {loading
        ? (
          <article className='loading-wrapper'>
            <Image
              src="/load.gif"
              alt="Loading"
              width={64}
              height={64}
              unoptimized
            />
          </article>
        )
        : (
          children
        )
      }
    </Main>
  );
}

export default Container;
