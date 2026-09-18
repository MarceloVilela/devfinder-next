import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Header from '../index'
import { useAuth } from '../../../hooks/auth'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))
jest.mock('../../../hooks/auth', () => ({
  useAuth: jest.fn(),
  isLoggedIn: (user: { _id?: string }) => Boolean(user?._id),
}))
jest.mock('react-toastify', () => ({ toast: { error: jest.fn() } }))
// next/dynamic(..., { ssr: false }) usa um LoadableComponent com transição de estado própria
// (resolve o chunk async mesmo com o módulo real mockado) — fora do que este teste cobre (campo
// de busca), e gera warning de act() sem isso; mockar dynamic direto evita o wrapper por completo.
jest.mock('next/dynamic', () => () => () => null)

const mockedUseRouter = useRouter as jest.Mock
const mockedUseAuth = useAuth as jest.Mock

describe('Header', () => {
  const refresh = jest.fn()
  const signOut = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockedUseRouter.mockReturnValue({ push: jest.fn(), refresh })
  })

  it('não mostra "Entrar" nem "Sair" enquanto a sessão ainda não hidratou (evita flash)', () => {
    mockedUseAuth.mockReturnValue({ user: {}, signOut, isHydrated: false })

    render(<Header />)

    expect(screen.queryByRole('link', { name: /entrar/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /sair/i })).not.toBeInTheDocument()
  })

  it('mostra "Entrar" levando pra /login quando não há sessão', () => {
    mockedUseAuth.mockReturnValue({ user: {}, signOut, isHydrated: true })

    render(<Header />)

    const entrar = screen.getByRole('link', { name: /entrar/i })
    expect(entrar).toHaveAttribute('href', '/login')
    expect(screen.queryByRole('button', { name: /sair/i })).not.toBeInTheDocument()
  })

  it('mostra "Sair" chamando signOut() e router.refresh() quando o backend confirma', async () => {
    signOut.mockResolvedValueOnce(true)
    mockedUseAuth.mockReturnValue({ user: { _id: 'u1' }, signOut, isHydrated: true })

    render(<Header />)

    expect(screen.queryByRole('link', { name: /entrar/i })).not.toBeInTheDocument()

    const sair = screen.getByRole('button', { name: /sair/i })
    await fireEvent.click(sair)

    expect(signOut).toHaveBeenCalled()
    expect(refresh).toHaveBeenCalled()
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('não chama router.refresh() e mostra toast de erro quando o backend não confirma o logout', async () => {
    signOut.mockResolvedValueOnce(false)
    mockedUseAuth.mockReturnValue({ user: { _id: 'u1' }, signOut, isHydrated: true })

    render(<Header />)

    const sair = screen.getByRole('button', { name: /sair/i })
    await fireEvent.click(sair)

    expect(signOut).toHaveBeenCalled()
    expect(refresh).not.toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalled()
  })
})
