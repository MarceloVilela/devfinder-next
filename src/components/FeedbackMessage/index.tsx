import React, { ReactNode } from 'react';

import Container from '../Container';

interface FeedbackMessageProps {
  message: string;
  action?: ReactNode;
}

// Peça de UI compartilhada entre error.tsx (erro de render inesperado) e o fallback local das
// listagens (falha/timeout do fetch) — mesma mensagem amigável, ação (retry) opcional porque só
// error.tsx (Client Component) tem `reset()`; o fallback local das listagens é Server Component.
const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ message, action }) => {
  return (
    <Container loading={false} className="containerVerticalCenter">
      <p role="alert">{message}</p>
      {action}
    </Container>
  );
};

export default FeedbackMessage;
