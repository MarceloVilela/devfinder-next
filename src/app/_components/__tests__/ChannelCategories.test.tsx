import { render, screen, fireEvent } from '@testing-library/react'

import ChannelCategories from '../ChannelCategories'
import { useAuth } from '../../../hooks/auth'
import type { ChannelData } from '../../../types'

jest.mock('../../../hooks/auth', () => ({ useAuth: jest.fn() }))

const mockedUseAuth = useAuth as jest.Mock

function channel(id: string, name: string, category: string): ChannelData {
  return {
    _id: id,
    name,
    category,
    tags: [],
    likes: [],
    deslikes: [],
    link: `https://www.youtube.com/channel/${id}`,
    userGithub: '',
    description: '',
    avatar: `https://yt3.ggpht.com/${id}`,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  }
}

const channels = [channel('c1', 'Canal Back', 'Backend'), channel('c2', 'Canal Front', 'Frontend')]

describe('ChannelCategories', () => {
  it('visitante vê "Todos os canais" e as categorias, sem Favoritos/Não seguidos', () => {
    mockedUseAuth.mockReturnValue({ user: {}, isHydrated: true })

    render(<ChannelCategories channelsStatic={channels} />)

    const options = screen.getAllByRole('option').map((option) => option.textContent)
    expect(options).toEqual(['Todos os canais', 'Backend', 'Frontend'])
    expect(screen.getByText('Canal Back')).toBeInTheDocument()
    expect(screen.getByText('Canal Front')).toBeInTheDocument()
  })

  it('escolher uma categoria filtra a lista', () => {
    mockedUseAuth.mockReturnValue({ user: {}, isHydrated: true })
    render(<ChannelCategories channelsStatic={channels} />)

    fireEvent.change(screen.getByLabelText('Filtrar canais por categoria'), { target: { value: '2' } })

    expect(screen.getByText('Canal Front')).toBeInTheDocument()
    expect(screen.queryByText('Canal Back')).not.toBeInTheDocument()
  })

  it('logado ganha Favoritos e Não seguidos, filtrando pelas listas do usuário', () => {
    mockedUseAuth.mockReturnValue({ user: { _id: 'u1', follow: ['c1'], ignore: ['c2'] }, isHydrated: true })
    render(<ChannelCategories channelsStatic={channels} />)

    const options = screen.getAllByRole('option').map((option) => option.textContent)
    expect(options).toEqual(['Todos os canais', 'Favoritos', 'Não seguidos', 'Backend', 'Frontend'])

    fireEvent.change(screen.getByLabelText('Filtrar canais por categoria'), { target: { value: '1' } })
    expect(screen.getByText('Canal Back')).toBeInTheDocument()
    expect(screen.queryByText('Canal Front')).not.toBeInTheDocument()
  })
})
