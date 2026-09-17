import React, { ReactNode } from 'react';

import { Container } from '../../components';
import { classNames } from '../../lib/classNames';
import './style.css';

interface ContainerFullWidthProps {
  children: ReactNode;
  loading: boolean;
  className?: string;
}

const ContainerFullWidth: React.FC<ContainerFullWidthProps> = ({ children, loading, className }) => {
  return (
    <Container loading={loading} className={classNames('video-list-shell', className)}>
      {children}
    </Container>
  );
};

interface VideoListProps {
  children: ReactNode;
  className?: string;
}

export const VideoList: React.FC<VideoListProps> = ({ children, className }) => {
  return (
    <ul className={classNames('video-list', className)}>
      {children}
    </ul>
  );
};

export default ContainerFullWidth;
