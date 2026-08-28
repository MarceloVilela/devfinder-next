'use client';

import { Header, Footer, Container } from '../components';

export default function NotFound() {
  return (
    <>
      <Header />

      <Container loading={false} className="containerVerticalCenter">
        <p>Página não encontrada.</p>
      </Container>

      <Footer />
    </>
  );
}
