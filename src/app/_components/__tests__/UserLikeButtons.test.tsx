import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { toast } from 'react-toastify'

import UserLikeButtons from '../UserLikeButtons'
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

const userId = 'dev-1'
const username = 'devuser'

function baseUser(overrides = {}) {
  return { _id: 'u1', likes: [] as string[], deslikes: [] as string[], ...overrides }
}

describe('UserLikeButtons', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('visitante sem sessão vê erro ao tentar favoritar, sem chamar a API', () => {
    const setUser = jest.fn()
    mockedUseAuth.mockReturnValue({ user: null, setUser, isHydrated: true })

    render(<UserLikeButtons userId={userId} username={username} />)
    fireEvent.click(screen.getByRole('button', { name: `Favoritar ${username}` }))

    expect(toast.error).toHaveBeenCalledWith('Acessando como visitante, não é possível favoritar.')
    expect(api.post).not.toHaveBeenCalled()
  })

  it('favoritar aplica UI otimista antes da resposta da API e sincroniza com a resposta', async () => {
    const setUser = jest.fn()
    const user = baseUser()
    mockedUseAuth.mockReturnValue({ user, setUser, isHydrated: true })
    api.post.mockResolvedValueOnce({ data: { ...user, likes: [userId] } })

    render(<UserLikeButtons userId={userId} username={username} />)
    fireEvent.click(screen.getByRole('button', { name: `Favoritar ${username}` }))

    // otimista: setUser já é chamado com o likes atualizado antes da API responder
    expect(setUser).toHaveBeenCalledWith({ ...user, likes: [userId] })

    await waitFor(() => expect(api.post).toHaveBeenCalledWith(`/likes/devs/${username}`))
    expect(toast.success).toHaveBeenCalledWith(`${username} foi para: Favoritos`)
    expect(setUser).toHaveBeenLastCalledWith({ ...user, likes: [userId] })
  })

  it('reverte a UI otimista quando a API falha ao favoritar', async () => {
    const setUser = jest.fn()
    const user = baseUser()
    mockedUseAuth.mockReturnValue({ user, setUser, isHydrated: true })
    api.post.mockRejectedValueOnce(new Error('network error'))

    render(<UserLikeButtons userId={userId} username={username} />)
    fireEvent.click(screen.getByRole('button', { name: `Favoritar ${username}` }))

    await waitFor(() => expect(setUser).toHaveBeenLastCalledWith(user))
    expect(toast.error).toHaveBeenCalledWith('Erro ao favoritar.')
  })

  it('desmarcar favorito chama DELETE /likes/devs/:username e atualiza o user com a resposta', async () => {
    const setUser = jest.fn()
    const user = baseUser({ likes: [userId] })
    mockedUseAuth.mockReturnValue({ user, setUser, isHydrated: true })
    api.delete.mockResolvedValueOnce({ data: { ...user, likes: [] } })

    render(<UserLikeButtons userId={userId} username={username} />)
    fireEvent.click(screen.getByRole('button', { name: 'Desmarcar' }))

    await waitFor(() => expect(api.delete).toHaveBeenCalledWith(`/likes/devs/${username}`))
    expect(setUser).toHaveBeenLastCalledWith({ ...user, likes: [] })
  })

  it('visitante sem sessão vê erro ao tentar desabilitar, sem chamar a API', () => {
    const setUser = jest.fn()
    mockedUseAuth.mockReturnValue({ user: null, setUser, isHydrated: true })

    render(<UserLikeButtons userId={userId} username={username} />)
    fireEvent.click(screen.getByRole('button', { name: `Marcar ${username} como não seguido` }))

    expect(toast.error).toHaveBeenCalledWith('Acessando como visitante, não é possível desabilitar.')
    expect(api.post).not.toHaveBeenCalled()
  })
})
