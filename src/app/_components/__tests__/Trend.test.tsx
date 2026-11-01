import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'

import Trend from '../Trend'
import api from '../../../services/api'
import type { VideoData } from '../../../types'

jest.mock('react-toastify', () => ({ toast: { error: jest.fn(), success: jest.fn() } }))
jest.mock('../../../services/api', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}))
// <Paginate> usa next/navigation — mesmo mock de Subs.test.tsx pra rodar fora de um App Router.
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}))

const mockedApiGet = api.get as jest.Mock

function video(id: string, title: string): VideoData {
  return {
    _id: id,
    title,
    url: `https://www.youtube.com/watch?v=${id}`,
    channel_id: 'c1',
    channel: 'Canal',
    channel_url: 'https://www.youtube.com/channel/c1',
    thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  }
}

const docsStatic = [video('v1', 'Video da página 1')]

function renderTrend() {
  return render(<Trend docsStatic={docsStatic} totalStatic={60} itemsPerPageStatic={30} />)
}

describe('Trend (Client Component, paginação CSR além da página 1)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    window.scrollTo = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push: jest.fn() })
    ;(usePathname as jest.Mock).mockReturnValue('/')
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams())
  })

  it('renderiza a página 1 que veio pronta do servidor, sem buscar nada', () => {
    renderTrend()

    expect(screen.getByText('Video da página 1')).toBeInTheDocument()
    expect(mockedApiGet).not.toHaveBeenCalled()
  })

  it('ir pra página 2 busca /feed/trending?page=2 e troca a lista', async () => {
    mockedApiGet.mockResolvedValueOnce({
      data: { docs: [video('v2', 'Video da página 2')], total: 60, itemsPerPage: 30 },
    })
    renderTrend()

    fireEvent.click(screen.getByText('2'))

    await waitFor(() => expect(screen.getByText('Video da página 2')).toBeInTheDocument())
    expect(mockedApiGet).toHaveBeenCalledWith('/feed/trending', { params: { page: 2 } })
    expect(screen.queryByText('Video da página 1')).not.toBeInTheDocument()
  })

  it('falha ao buscar mostra toast e restaura a página anterior', async () => {
    mockedApiGet.mockRejectedValueOnce({ isAxiosError: true, response: { status: 404 } })
    renderTrend()

    fireEvent.click(screen.getByText('2'))

    await waitFor(() => expect(toast.error).toHaveBeenCalled())
    await waitFor(() => expect(screen.getByText('Video da página 1')).toBeInTheDocument())
  })

  it('voltar pra página 1 usa o dado estático, sem refetch', async () => {
    mockedApiGet.mockResolvedValueOnce({
      data: { docs: [video('v2', 'Video da página 2')], total: 60, itemsPerPage: 30 },
    })
    renderTrend()

    fireEvent.click(screen.getByText('2'))
    await waitFor(() => expect(screen.getByText('Video da página 2')).toBeInTheDocument())

    fireEvent.click(screen.getByText('1'))

    await waitFor(() => expect(screen.getByText('Video da página 1')).toBeInTheDocument())
    expect(mockedApiGet).toHaveBeenCalledTimes(1)
  })
})
