import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'

import UserAll from '../UserAll'
import api from '../../../services/api'
import type { UserData } from '../../../types'

jest.mock('react-toastify', () => ({ toast: { error: jest.fn(), success: jest.fn() } }))
jest.mock('../../../services/api', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}))
// Cada card renderiza <UserLikeButtons> (useOptimisticToggle -> useAuth); visitante basta aqui.
jest.mock('../../../hooks/auth', () => ({
  useAuth: () => ({ user: {}, setUser: jest.fn(), isHydrated: true }),
}))
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}))

const mockedApiGet = api.get as jest.Mock

function dev(id: string, name: string): UserData {
  return {
    _id: id,
    user: id,
    name,
    avatar: `https://avatars.githubusercontent.com/u/${id.length}`,
    likes: [],
    deslikes: [],
    follow: [],
    ignore: [],
    createdAt: new Date(0),
    updatedAt: new Date(0),
  }
}

const docsStatic = [dev('dev1', 'Dev da página 1')]

function renderUserAll() {
  return render(<UserAll docsStatic={docsStatic} totalStatic={60} itemsPerPageStatic={30} />)
}

describe('UserAll (Client Component, paginação CSR além da página 1)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    window.scrollTo = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push: jest.fn() })
    ;(usePathname as jest.Mock).mockReturnValue('/user')
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams())
  })

  it('renderiza a página 1 que veio pronta do servidor, sem buscar nada', () => {
    renderUserAll()

    expect(screen.getByText('Dev da página 1')).toBeInTheDocument()
    expect(mockedApiGet).not.toHaveBeenCalled()
  })

  it('ir pra página 2 busca /devs?page=2 e troca a lista', async () => {
    mockedApiGet.mockResolvedValueOnce({
      data: { docs: [dev('dev2', 'Dev da página 2')], total: 60, itemsPerPage: 30 },
    })
    renderUserAll()

    fireEvent.click(screen.getByText('2'))

    await waitFor(() => expect(screen.getByText('Dev da página 2')).toBeInTheDocument())
    expect(mockedApiGet).toHaveBeenCalledWith('/devs', { params: { page: 2 } })
    expect(screen.queryByText('Dev da página 1')).not.toBeInTheDocument()
  })

  it('falha ao buscar mostra toast e restaura a página anterior', async () => {
    mockedApiGet.mockRejectedValueOnce({ isAxiosError: true, response: { status: 404 } })
    renderUserAll()

    fireEvent.click(screen.getByText('2'))

    await waitFor(() => expect(toast.error).toHaveBeenCalled())
    await waitFor(() => expect(screen.getByText('Dev da página 1')).toBeInTheDocument())
  })
})
