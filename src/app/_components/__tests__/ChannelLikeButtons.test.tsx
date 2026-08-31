import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { toast } from 'react-toastify'

import ChannelLikeButtons from '../ChannelLikeButtons'
import apiDefault from '../../../services/api'
import { useAuth } from '../../../hooks/auth'

jest.mock('react-toastify', () => ({ toast: { error: jest.fn(), success: jest.fn() } }))
jest.mock('../../../services/api', () => ({
  __esModule: true,
  default: { post: jest.fn(), delete: jest.fn() },
}))
jest.mock('../../../hooks/auth', () => ({ useAuth: jest.fn() }))

const api = apiDefault as unknown as { post: jest.Mock; delete: jest.Mock }
const mockedUseAuth = useAuth as jest.Mock

const channelId = 'chan-1'
const channelName = 'devchannel'

function baseUser(overrides = {}) {
  return { _id: 'u1', follow: [] as string[], ignore: [] as string[], ...overrides }
}

describe('ChannelLikeButtons', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('visitante sem sessão vê erro ao tentar favoritar, sem chamar a API', () => {
    const setUser = jest.fn()
    mockedUseAuth.mockReturnValue({ user: null, setUser, isHydrated: true })

    render(<ChannelLikeButtons channelId={channelId} channelName={channelName} />)
    fireEvent.click(screen.getByRole('button', { name: `Favoritar ${channelName}` }))

    expect(toast.error).toHaveBeenCalledWith('Acessando como visitante, não é possível favoritar.')
    expect(api.post).not.toHaveBeenCalled()
  })

  it('favoritar aplica UI otimista antes da resposta da API', async () => {
    const setUser = jest.fn()
    const user = baseUser()
    mockedUseAuth.mockReturnValue({ user, setUser, isHydrated: true })
    api.post.mockResolvedValueOnce({ data: { ...user, follow: [channelId] } })

    render(<ChannelLikeButtons channelId={channelId} channelName={channelName} />)
    fireEvent.click(screen.getByRole('button', { name: `Favoritar ${channelName}` }))

    // otimista: setUser já é chamado com o follow atualizado antes da API responder
    expect(setUser).toHaveBeenCalledWith({ ...user, follow: [channelId] })

    await waitFor(() => expect(api.post).toHaveBeenCalledWith(`/likes/channels/${channelName}`))
    expect(toast.success).toHaveBeenCalledWith(`${channelName} foi para: Favoritos`)
    expect(setUser).toHaveBeenLastCalledWith({ ...user, follow: [channelId] })
  })

  it('reverte a UI otimista quando a API falha ao favoritar', async () => {
    const setUser = jest.fn()
    const user = baseUser()
    mockedUseAuth.mockReturnValue({ user, setUser, isHydrated: true })
    api.post.mockRejectedValueOnce(new Error('network error'))

    render(<ChannelLikeButtons channelId={channelId} channelName={channelName} />)
    fireEvent.click(screen.getByRole('button', { name: `Favoritar ${channelName}` }))

    await waitFor(() => expect(setUser).toHaveBeenLastCalledWith(user))
    expect(toast.error).toHaveBeenCalledWith('Erro ao favoritar.')
  })

  it('desmarcar favorito chama DELETE e atualiza o user com a resposta', async () => {
    const setUser = jest.fn()
    const user = baseUser({ follow: [channelId] })
    mockedUseAuth.mockReturnValue({ user, setUser, isHydrated: true })
    api.delete.mockResolvedValueOnce({ data: { ...user, follow: [] } })

    render(<ChannelLikeButtons channelId={channelId} channelName={channelName} />)
    fireEvent.click(screen.getByRole('button', { name: 'Desmarcar' }))

    await waitFor(() => expect(api.delete).toHaveBeenCalledWith(`/likes/channels/${channelName}`))
    expect(setUser).toHaveBeenLastCalledWith({ ...user, follow: [] })
  })

  it('visitante sem sessão vê erro ao tentar desabilitar, sem chamar a API', () => {
    const setUser = jest.fn()
    mockedUseAuth.mockReturnValue({ user: null, setUser, isHydrated: true })

    render(<ChannelLikeButtons channelId={channelId} channelName={channelName} />)
    fireEvent.click(screen.getByRole('button', { name: `Marcar ${channelName} como não seguido` }))

    expect(toast.error).toHaveBeenCalledWith('Acessando como visitante, não é possível desabilitar.')
    expect(api.post).not.toHaveBeenCalled()
  })
})
