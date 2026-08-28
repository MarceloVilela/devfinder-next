'use client';

import { Header, Footer, Container } from '../components';

export default function ErrorPage({ error }: { error: Error & { digest?: string } }) {
  return (
    <>
      <Header />

      <Container loading={false} className="containerVerticalCenter">
        <p>Algo deu errado. Tente novamente em instantes.</p>
      </Container>

      <Footer />
    </>
  );
}
