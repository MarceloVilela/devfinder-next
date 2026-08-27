import { AxiosError } from 'axios'

import getErrorMessage from '../getErrorMessage'

function makeAxiosError(response?: { status: number }): AxiosError {
  const error = new AxiosError()
  error.isAxiosError = true
  if (response) {
    error.response = response as AxiosError['response']
  }
  return error
}

describe('getErrorMessage', () => {
  it('retorna mensagem de conexão quando não há response (erro de rede/timeout)', () => {
    const error = makeAxiosError()

    expect(getErrorMessage(error, 'Recurso não encontrado.')).toBe(
      'Não foi possível conectar à API. Verifique sua conexão e tente novamente.'
    )
  })

  it('retorna a mensagem de "não encontrado" em 404', () => {
    const error = makeAxiosError({ status: 404 })

    expect(getErrorMessage(error, 'Recurso não encontrado.')).toBe('Recurso não encontrado.')
  })

  it('retorna mensagem genérica para os demais status', () => {
    const error = makeAxiosError({ status: 500 })

    expect(getErrorMessage(error, 'Recurso não encontrado.')).toBe(
      'Ocorreu um erro inesperado. Tente novamente.'
    )
  })

  it('retorna mensagem genérica para erro que não é do axios', () => {
    expect(getErrorMessage(new Error('boom'), 'Recurso não encontrado.')).toBe(
      'Ocorreu um erro inesperado. Tente novamente.'
    )
  })
})
