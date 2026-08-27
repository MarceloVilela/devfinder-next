import { NextPageContext } from 'next'

import { Header, Footer, Container } from '../components'

interface ErrorPageProps {
  statusCode?: number
}

function ErrorPage({ statusCode }: ErrorPageProps) {
  return (
    <>
      <Header />

      <Container loading={false} className="containerVerticalCenter">
        <p>
          {statusCode === 404
            ? 'Página não encontrada.'
            : 'Algo deu errado. Tente novamente em instantes.'}
        </p>
      </Container>

      <Footer />
    </>
  )
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default ErrorPage
