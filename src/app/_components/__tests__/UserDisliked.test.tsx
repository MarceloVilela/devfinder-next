import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { toast } from 'react-toastify'

import UserDisliked from '../UserDisliked'
import apiDefault from '../../../services/api'
import { useAuth } from '../../../hooks/auth'

jest.mock('react-toastify', () => ({ toast: { error: jest.fn(), success: jest.fn() } }))
jest.mock('../../../services/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), delete: jest.fn() },
}))
jest.mock('../../../hooks/auth', () => ({ useAuth: jest.fn() }))

const api = apiDefault as unknown as { get: jest.Mock; delete: jest.Mock }
const mockedUseAuth = useAuth as jest.Mock

const devUser = { user: 'devuser', name: 'Dev User', _id: 'u1' }

describe('UserDisliked', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedUseAuth.mockReturnValue({ user: { _id: 'me' }, isHydrated: true })
    api.get.mockResolvedValue({ data: [devUser] })
  })

  it('desfazer chama DELETE /dislikes/devs/:username', async () => {
    api.delete.mockResolvedValueOnce({})

    render(<UserDisliked />)
    await screen.findByText('Desmarcar')

    fireEvent.click(screen.getByText('Desmarcar'))

    await waitFor(() => expect(api.delete).toHaveBeenCalledWith(`/dislikes/devs/${devUser.user}`))
    expect(toast.success).toHaveBeenCalledWith(`${devUser.user} saiu de: Não seguidos`)
  })

  it('mostra toast de erro quando o desfazer falha, sem quebrar a lista', async () => {
    api.delete.mockRejectedValueOnce(new Error('network error'))

    render(<UserDisliked />)
    await screen.findByText('Desmarcar')

    fireEvent.click(screen.getByText('Desmarcar'))

    await waitFor(() => expect(toast.error).toHaveBeenCalled())
    expect(screen.getByText('Desmarcar')).toBeInTheDocument()
  })

  it('visitante sem sessão vê erro de visitante ao desfazer, sem chamar a API', async () => {
    mockedUseAuth.mockReturnValue({ user: {}, isHydrated: true })

    render(<UserDisliked />)
    await screen.findByText('Desmarcar')

    fireEvent.click(screen.getByText('Desmarcar'))

    expect(toast.error).toHaveBeenCalledWith('Acessando como visitante, não é possível desabilitar.')
    expect(api.delete).not.toHaveBeenCalled()
  })
})
