'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  const [stylesheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = stylesheet.getStyleElement();
    stylesheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== 'undefined') return <>{children}</>;

  return (
    <StyleSheetManager sheet={stylesheet.instance}>
      {children}
    </StyleSheetManager>
  );
}
