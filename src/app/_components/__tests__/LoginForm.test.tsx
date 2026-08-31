import { render } from '@testing-library/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'

import LoginForm from '../LoginForm'
import { useAuth } from '../../../hooks/auth'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))
jest.mock('react-toastify', () => ({ toast: { error: jest.fn() } }))
jest.mock('../../../hooks/auth', () => ({ useAuth: jest.fn() }))

const mockedUseRouter = useRouter as jest.Mock
const mockedUseSearchParams = useSearchParams as jest.Mock
const mockedUseAuth = useAuth as jest.Mock

describe('LoginForm', () => {
  const push = jest.fn()
  const signOut = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockedUseRouter.mockReturnValue({ push })
  })

  it('faz logout quando a URL tem ?logout e não redireciona pra home', () => {
    mockedUseSearchParams.mockReturnValue(new URLSearchParams('logout=1'))
    mockedUseAuth.mockReturnValue({ user: null, signOut, message: null, isHydrated: true })

    render(<LoginForm />)

    expect(signOut).toHaveBeenCalled()
    expect(push).not.toHaveBeenCalled()
  })

  it('redireciona pra home quando a sessão já hidratou com usuário logado', () => {
    mockedUseSearchParams.mockReturnValue(new URLSearchParams())
    mockedUseAuth.mockReturnValue({
      user: { _id: 'u1' },
      signOut,
      message: null,
      isHydrated: true,
    })

    render(<LoginForm />)

    expect(push).toHaveBeenCalledWith('/')
  })

  it('não redireciona enquanto a sessão ainda não hidratou (evita flash pra usuário logado)', () => {
    mockedUseSearchParams.mockReturnValue(new URLSearchParams())
    mockedUseAuth.mockReturnValue({
      user: { _id: 'u1' },
      signOut,
      message: null,
      isHydrated: false,
    })

    render(<LoginForm />)

    expect(push).not.toHaveBeenCalled()
  })

  it('não redireciona visitante sem sessão', () => {
    mockedUseSearchParams.mockReturnValue(new URLSearchParams())
    mockedUseAuth.mockReturnValue({ user: null, signOut, message: null, isHydrated: true })

    render(<LoginForm />)

    expect(push).not.toHaveBeenCalled()
  })

  it('mostra toast de erro quando useAuth expõe uma message', () => {
    mockedUseSearchParams.mockReturnValue(new URLSearchParams())
    mockedUseAuth.mockReturnValue({
      user: null,
      signOut,
      message: { content: 'sessão expirada' },
      isHydrated: true,
    })

    render(<LoginForm />)

    expect(toast.error).toHaveBeenCalledWith('sessão expirada')
  })
})
