import { render, screen } from '@testing-library/react'

import UserLiked from '../UserLiked'
import { fetchSessionJSON, redirectIfSessionExpired } from '../../../lib/fetchSessionJSON'

jest.mock('../../../lib/fetchSessionJSON', () => ({
  fetchSessionJSON: jest.fn(),
  redirectIfSessionExpired: jest.fn(),
}))
jest.mock('../../../services/api', () => ({
  __esModule: true,
  default: { delete: jest.fn() },
}))

const mockedFetchSessionJSON = fetchSessionJSON as jest.Mock
const mockedRedirectIfSessionExpired = redirectIfSessionExpired as jest.Mock

describe('UserLiked (Server Component)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('busca /likes/devs com o token e renderiza a lista', async () => {
    mockedFetchSessionJSON.mockResolvedValueOnce([
      { _id: 'u1', user: 'devuser', name: 'Dev User', avatar: 'https://avatars.githubusercontent.com/u/1' },
    ])

    const jsx = await UserLiked({ token: 'abc123' })
    render(jsx)

    expect(mockedFetchSessionJSON).toHaveBeenCalledWith('/likes/devs', 'abc123')
    expect(screen.getByText('Dev User')).toBeInTheDocument()
    expect(screen.getByText('Desmarcar')).toBeInTheDocument()
  })

  it('renderiza mensagem de erro inline quando o fetch falha, sem lançar', async () => {
    const error = new Error('network error')
    mockedFetchSessionJSON.mockRejectedValueOnce(error)

    const jsx = await UserLiked({ token: 'abc123' })
    render(jsx)

    // redirectIfSessionExpired é chamado com o erro capturado antes do fallback genérico —
    // é ele quem decide se o caso é sessão expirada (redireciona) ou outra falha (mostra este
    // fallback); aqui o mock é no-op, então cai no fallback.
    expect(mockedRedirectIfSessionExpired).toHaveBeenCalledWith(error)
    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível carregar seus favoritos agora.')
  })
})
