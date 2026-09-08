import { render, screen } from '@testing-library/react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

import Subs from '../Subs'
import { fetchSessionJSON, redirectIfSessionExpired } from '../../../lib/fetchSessionJSON'

jest.mock('../../../lib/fetchSessionJSON', () => ({
  fetchSessionJSON: jest.fn(),
  redirectIfSessionExpired: jest.fn(),
}))
// Subs renderiza <Paginate>, que usa next/navigation — precisa do mesmo mock de
// Paginate.test.tsx pra rodar fora de um App Router de verdade.
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}))

const mockedFetchSessionJSON = fetchSessionJSON as jest.Mock
const mockedRedirectIfSessionExpired = redirectIfSessionExpired as jest.Mock

describe('Subs (Server Component)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: jest.fn() })
    ;(usePathname as jest.Mock).mockReturnValue('/')
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams())
  })

  it('busca /feed/subscriptions com token e page, e pagina via ?subsPage=', async () => {
    mockedFetchSessionJSON.mockResolvedValueOnce({
      docs: [{ _id: 'v1', title: 'Video 1', channel: 'Canal 1', thumbnail: 'https://i.ytimg.com/vi/abc/default.jpg', url: 'https://youtube.com/watch?v=abc' }],
      total: 60,
      itemsPerPage: 30,
    })

    const jsx = await Subs({ token: 'abc123', page: 2 })
    render(jsx)

    expect(mockedFetchSessionJSON).toHaveBeenCalledWith('/feed/subscriptions?page=2', 'abc123')
    expect(screen.getByText('Video 1')).toBeInTheDocument()
  })

  it('renderiza mensagem de erro inline quando o fetch falha, sem lançar', async () => {
    const error = new Error('network error')
    mockedFetchSessionJSON.mockRejectedValueOnce(error)

    const jsx = await Subs({ token: 'abc123', page: 1 })
    render(jsx)

    expect(mockedRedirectIfSessionExpired).toHaveBeenCalledWith(error)
    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível carregar suas inscrições agora.')
  })
})
