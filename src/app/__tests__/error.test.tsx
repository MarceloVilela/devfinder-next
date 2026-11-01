import { render, screen, fireEvent } from '@testing-library/react'

import ErrorPage from '../error'

describe('error.tsx', () => {
  it('mostra a mensagem genérica e "Tentar novamente" chama reset', () => {
    const reset = jest.fn()

    render(<ErrorPage error={new Error('falha de rede')} reset={reset} />)

    expect(screen.getByRole('alert')).toHaveTextContent('Algo deu errado. Tente novamente em instantes.')
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(reset).toHaveBeenCalledTimes(1)
  })

  it('não vaza a mensagem do erro pra tela (o Next a redige em produção)', () => {
    render(<ErrorPage error={new Error('segredo interno')} reset={jest.fn()} />)

    expect(screen.queryByText(/segredo interno/)).not.toBeInTheDocument()
  })
})
