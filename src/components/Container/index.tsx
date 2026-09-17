import React, { ReactNode } from 'react';
import Image from 'next/image';

import { classNames } from '../../lib/classNames';
import './style.css';

interface ContainerProps {
  children: ReactNode;
  loading: boolean;
  className?: string;
  unstylized?: boolean;
}

const Container: React.FC<ContainerProps> = ({ children, loading, className, unstylized }) => {
  return (
    <main className={classNames(unstylized ? '' : 'container', className)}>
      {loading
        ? (
          <article className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
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
    </main>
  );
}

export default Container;
