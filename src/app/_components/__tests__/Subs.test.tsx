import { render, screen, waitFor } from '@testing-library/react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

import Subs from '../Subs'
import api from '../../../services/api'
import { useAuth } from '../../../hooks/auth'

jest.mock('../../../services/api', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}))
jest.mock('../../../hooks/auth', () => ({
  useAuth: jest.fn(),
  isLoggedIn: (user: { _id?: string }) => Boolean(user?._id),
}))
// Subs renderiza <Paginate>, que usa next/navigation — precisa do mesmo mock de
// Paginate.test.tsx pra rodar fora de um App Router de verdade.
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}))

const mockedApiGet = api.get as jest.Mock
const mockedUseAuth = useAuth as jest.Mock

describe('Subs (Client Component, CSR)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: jest.fn() })
    ;(usePathname as jest.Mock).mockReturnValue('/')
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams())
  })

  it('não busca nada antes da sessão hidratar', () => {
    mockedUseAuth.mockReturnValue({ user: {}, isHydrated: false })

    render(<Subs />)

    expect(mockedApiGet).not.toHaveBeenCalled()
  })

  it('não busca nada pra visitante sem sessão', () => {
    mockedUseAuth.mockReturnValue({ user: {}, isHydrated: true })

    render(<Subs />)

    expect(mockedApiGet).not.toHaveBeenCalled()
  })

  it('busca /feed/subscriptions assim que a sessão hidrata logada, e renderiza a lista', async () => {
    mockedUseAuth.mockReturnValue({ user: { _id: 'u1' }, isHydrated: true })
    mockedApiGet.mockResolvedValueOnce({
      data: {
        docs: [{ _id: 'v1', title: 'Video 1', channel: 'Canal 1', thumbnail: 'https://i.ytimg.com/vi/abc/default.jpg', url: 'https://youtube.com/watch?v=abc' }],
        total: 60,
        itemsPerPage: 30,
      },
    })

    render(<Subs />)

    await waitFor(() => expect(screen.getByText('Video 1')).toBeInTheDocument())

    expect(mockedApiGet).toHaveBeenCalledWith('/feed/subscriptions', { params: { page: 1 } })
  })

  it('renderiza mensagem de erro inline quando o fetch falha, sem lançar', async () => {
    mockedUseAuth.mockReturnValue({ user: { _id: 'u1' }, isHydrated: true })
    mockedApiGet.mockRejectedValueOnce(new Error('network error'))

    render(<Subs />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível carregar suas inscrições agora.')
    })
  })
})
