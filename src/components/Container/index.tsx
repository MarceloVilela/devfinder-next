import React, { ReactNode } from 'react';

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
            <img
              src="/load.gif"
              alt="Loading"
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
