import React, { ReactNode } from 'react';

import { StatusRegion } from './style';

interface CardSkeletonProps {
  loading: boolean;
  loadingLabel?: string;
  children: ReactNode;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({ loading, loadingLabel = 'Carregando...', children }) => {
  return (
    <>
      <div aria-hidden={loading || undefined}>
        {children}
      </div>
      <StatusRegion role="status" aria-live="polite">
        {loading ? loadingLabel : ''}
      </StatusRegion>
    </>
  );
}

export default CardSkeleton;
