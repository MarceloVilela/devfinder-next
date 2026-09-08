import { render, screen } from '@testing-library/react'

import UserDisliked from '../UserDisliked'
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

describe('UserDisliked (Server Component)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('busca /dislikes/devs com o token e renderiza a lista', async () => {
    mockedFetchSessionJSON.mockResolvedValueOnce([
      { _id: 'u1', user: 'devuser', name: 'Dev User', avatar: 'https://avatars.githubusercontent.com/u/1' },
    ])

    const jsx = await UserDisliked({ token: 'abc123' })
    render(jsx)

    expect(mockedFetchSessionJSON).toHaveBeenCalledWith('/dislikes/devs', 'abc123')
    expect(screen.getByText('Dev User')).toBeInTheDocument()
    expect(screen.getByText('Desmarcar')).toBeInTheDocument()
  })

  it('renderiza mensagem de erro inline quando o fetch falha, sem lançar', async () => {
    const error = new Error('network error')
    mockedFetchSessionJSON.mockRejectedValueOnce(error)

    const jsx = await UserDisliked({ token: 'abc123' })
    render(jsx)

    expect(mockedRedirectIfSessionExpired).toHaveBeenCalledWith(error)
    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível carregar sua lista de não seguidos agora.')
  })
})
