'use client';

import { Container } from '../components';

export default function ErrorPage({ error }: { error: Error & { digest?: string } }) {
  return (
    <Container loading={false} className="containerVerticalCenter">
      <p>Algo deu errado. Tente novamente em instantes.</p>
    </Container>
  );
}
