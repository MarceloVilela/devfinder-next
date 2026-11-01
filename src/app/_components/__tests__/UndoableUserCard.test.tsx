import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { toast } from 'react-toastify'

import { UndoableUserCard } from '../UndoableUserCard'
import type { UserData } from '../../../types'
import apiDefault from '../../../services/api'

jest.mock('react-toastify', () => ({ toast: { error: jest.fn(), success: jest.fn() } }))
jest.mock('../../../services/api', () => ({
  __esModule: true,
  default: { delete: jest.fn() },
}))

const api = apiDefault as unknown as { delete: jest.Mock }

const user: UserData = {
  _id: 'u1',
  user: 'devuser',
  name: 'Dev User',
  avatar: 'https://avatars.githubusercontent.com/u/1',
  likes: [],
  deslikes: [],
  follow: [],
  ignore: [],
  createdAt: new Date(0),
  updatedAt: new Date(0),
}

describe('UndoableUserCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('desfazer chama DELETE no endpoint informado e remove o card da tela', async () => {
    api.delete.mockResolvedValueOnce({})

    const { container } = render(
      <UndoableUserCard
        user={user}
        endpoint="/likes/devs/devuser"
        successMessage="devuser saiu de: Favoritos"
        errorFallback="Erro ao desfazer favorito."
        kind="like"
      />
    )

    // comportamento original preservado (UserLiked.tsx pré-M1): ícone de "like" leva a classe
    // "dislike" (dita a direção da animação de hover, sem relação com o kind) — regressão
    // pega no code-review da migração, ver comentário em UndoableUserCard.tsx.
    expect(container.querySelector('svg.dislike')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Desmarcar'))

    await waitFor(() => expect(api.delete).toHaveBeenCalledWith('/likes/devs/devuser'))
    expect(toast.success).toHaveBeenCalledWith('devuser saiu de: Favoritos')
    await waitFor(() => expect(screen.queryByText('Desmarcar')).not.toBeInTheDocument())
  })

  it('mostra toast de erro e mantém o card quando o desfazer falha', async () => {
    api.delete.mockRejectedValueOnce({ isAxiosError: true, response: { status: 404 } })

    const { container } = render(
      <UndoableUserCard
        user={user}
        endpoint="/dislikes/devs/devuser"
        successMessage="devuser saiu de: Não seguidos"
        errorFallback="Erro ao desfazer."
        kind="dislike"
      />
    )

    expect(container.querySelector('svg.dislike')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('Desmarcar'))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao desfazer.'))
    expect(screen.getByText('Desmarcar')).toBeInTheDocument()
  })

  it('"Desmarcar" tem nome acessível com a entidade, começando pelo texto visível', () => {
    const { unmount } = render(
      <UndoableUserCard user={user} endpoint="/likes/devs/devuser" successMessage="ok" errorFallback="erro" kind="like" />
    )
    expect(screen.getByRole('button', { name: 'Desmarcar favorito devuser' })).toHaveTextContent('Desmarcar')
    unmount()

    render(
      <UndoableUserCard user={user} endpoint="/dislikes/devs/devuser" successMessage="ok" errorFallback="erro" kind="dislike" />
    )
    expect(screen.getByRole('button', { name: 'Desmarcar devuser como não seguido' })).toHaveTextContent('Desmarcar')
  })

  it('move o foco para o próximo card quando o desfazer remove o card focado', async () => {
    api.delete.mockResolvedValueOnce({})
    const outro: UserData = { ...user, _id: 'u2', user: 'outrouser', name: 'Outro User' }

    render(
      <ul>
        <UndoableUserCard user={user} endpoint="/likes/devs/devuser" successMessage="ok" errorFallback="erro" kind="like" />
        <UndoableUserCard user={outro} endpoint="/likes/devs/outrouser" successMessage="ok" errorFallback="erro" kind="like" />
      </ul>
    )

    const desfazer = screen.getByRole('button', { name: 'Desmarcar favorito devuser' })
    desfazer.focus()
    fireEvent.click(desfazer)

    await waitFor(() => expect(screen.queryByRole('button', { name: 'Desmarcar favorito devuser' })).not.toBeInTheDocument())
    // vai pro botão de ação do vizinho, não pro link do avatar (externo, target=_blank)
    expect(screen.getByRole('button', { name: 'Desmarcar favorito outrouser' })).toHaveFocus()
  })

  it('não rouba o foco se o usuário já foi pra outro elemento durante a request', async () => {
    let resolveDelete: (value: unknown) => void = () => {}
    api.delete.mockImplementationOnce(() => new Promise((resolve) => { resolveDelete = resolve }))
    const outro: UserData = { ...user, _id: 'u2', user: 'outrouser', name: 'Outro User' }

    render(
      <>
        <ul>
          <UndoableUserCard user={user} endpoint="/likes/devs/devuser" successMessage="ok" errorFallback="erro" kind="like" />
          <UndoableUserCard user={outro} endpoint="/likes/devs/outrouser" successMessage="ok" errorFallback="erro" kind="like" />
        </ul>
        <input aria-label="busca" />
      </>
    )

    const desfazer = screen.getByRole('button', { name: 'Desmarcar favorito devuser' })
    desfazer.focus()
    fireEvent.click(desfazer)
    screen.getByLabelText('busca').focus()
    resolveDelete({})

    await waitFor(() => expect(screen.queryByRole('button', { name: 'Desmarcar favorito devuser' })).not.toBeInTheDocument())
    expect(screen.getByLabelText('busca')).toHaveFocus()
  })
})
