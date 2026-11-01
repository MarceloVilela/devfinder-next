import React, { ReactNode } from 'react';

import { classNames } from '../../lib/classNames';
import './style.css';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  unstylized?: boolean;
}

const Container: React.FC<ContainerProps> = ({ children, className, unstylized }) => {
  return (
    <main className={classNames(unstylized ? '' : 'app-container', className)}>
      {children}
    </main>
  );
}

export default Container;
