import { render, screen, waitFor } from '@testing-library/react'

import UserDisliked from '../UserDisliked'
import api from '../../../services/api'
import { useAuth } from '../../../hooks/auth'

jest.mock('../../../services/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), delete: jest.fn() },
}))
jest.mock('../../../hooks/auth', () => ({
  useAuth: jest.fn(),
  isLoggedIn: (user: { _id?: string }) => Boolean(user?._id),
}))

const mockedApiGet = api.get as jest.Mock
const mockedUseAuth = useAuth as jest.Mock

describe('UserDisliked (Client Component, CSR)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('não busca nada antes da sessão hidratar logada', () => {
    mockedUseAuth.mockReturnValue({ user: {}, isHydrated: false })

    render(<UserDisliked />)

    expect(mockedApiGet).not.toHaveBeenCalled()
  })

  it('busca /dislikes/devs assim que a sessão hidrata logada, e renderiza a lista', async () => {
    mockedUseAuth.mockReturnValue({ user: { _id: 'u1' }, isHydrated: true })
    mockedApiGet.mockResolvedValueOnce({
      data: [{ _id: 'u1', user: 'devuser', name: 'Dev User', avatar: 'https://avatars.githubusercontent.com/u/1' }],
    })

    render(<UserDisliked />)

    await waitFor(() => expect(screen.getByText('Dev User')).toBeInTheDocument())

    expect(mockedApiGet).toHaveBeenCalledWith('/dislikes/devs')
    expect(screen.getByText('Desmarcar')).toBeInTheDocument()
  })

  it('renderiza mensagem de erro inline quando o fetch falha, sem lançar', async () => {
    mockedUseAuth.mockReturnValue({ user: { _id: 'u1' }, isHydrated: true })
    mockedApiGet.mockRejectedValueOnce(new Error('network error'))

    render(<UserDisliked />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível carregar sua lista de não seguidos agora.')
    })
  })
})
