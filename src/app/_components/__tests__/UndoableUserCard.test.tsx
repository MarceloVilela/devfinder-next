import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { toast } from 'react-toastify'

import { UndoableUserCard } from '../UndoableUserCard'
import apiDefault from '../../../services/api'

jest.mock('react-toastify', () => ({ toast: { error: jest.fn(), success: jest.fn() } }))
jest.mock('../../../services/api', () => ({
  __esModule: true,
  default: { delete: jest.fn() },
}))

const api = apiDefault as unknown as { delete: jest.Mock }

const user = { _id: 'u1', user: 'devuser', name: 'Dev User', avatar: 'https://avatars.githubusercontent.com/u/1' } as any

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
})
