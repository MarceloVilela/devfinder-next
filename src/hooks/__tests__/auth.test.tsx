import { renderHook, act } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

import { useAuth, hydrateAuth, UserData } from '../auth'
import authReducer from '../../store/slices/authSlice'
import apiDefault from '../../services/api'

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}))

const api = apiDefault as unknown as { get: jest.Mock; post: jest.Mock }

const user = { _id: '1', name: 'Octocat', user: 'octocat' } as UserData

function makeStore() {
  // store isolada por teste — a store do Redux é singleton por natureza,
  // sem isso um teste herdaria o estado deixado pelo anterior
  return configureStore({ reducer: { auth: authReducer } })
}

describe('useAuth', () => {
  beforeEach(() => {
    api.get.mockReset()
    api.post.mockReset()
  })

  function renderUseAuth(testStore = makeStore()) {
    return renderHook(() => useAuth(), {
      wrapper: ({ children }) => <Provider store={testStore}>{children}</Provider>,
    })
  }

  it('socialAuthCallback grava o user no estado (sessão já veio no cookie httpOnly)', () => {
    const { result } = renderUseAuth()

    act(() => result.current.socialAuthCallback({ user }))

    expect(result.current.user).toEqual(user)
  })

  it('signOut chama o backend pra limpar o cookie e limpa o user do estado', async () => {
    api.post.mockResolvedValueOnce({})
    const { result } = renderUseAuth()

    act(() => result.current.socialAuthCallback({ user }))
    await act(async () => result.current.signOut())

    expect(api.post).toHaveBeenCalledWith('/auth/logout')
    expect(result.current.user).toEqual({})
  })

  it('signOut limpa o estado mesmo se a chamada ao backend falhar', async () => {
    api.post.mockRejectedValueOnce(new Error('network error'))
    const { result } = renderUseAuth()

    act(() => result.current.socialAuthCallback({ user }))
    await act(async () => result.current.signOut())

    expect(result.current.user).toEqual({})
  })
})

describe('hydrateAuth', () => {
  beforeEach(() => {
    api.get.mockReset()
  })

  it('popula o user quando GET /me responde com sessão válida (cookie presente)', async () => {
    api.get.mockResolvedValueOnce({ data: user })
    const store = makeStore()

    await act(async () => hydrateAuth()(store.dispatch))

    expect(store.getState().auth.user).toEqual(user)
    expect(store.getState().auth.isHydrated).toBe(true)
  })

  it('segue anônimo quando GET /me devolve 401 (sem cookie)', async () => {
    api.get.mockRejectedValueOnce({ response: { status: 401 } })
    const store = makeStore()

    await act(async () => hydrateAuth()(store.dispatch))

    expect(store.getState().auth.user).toEqual({})
    expect(store.getState().auth.isHydrated).toBe(true)
  })

  it('limpa token/user residuais de localStorage de antes da migração pra cookie', async () => {
    localStorage.setItem('@DevFinder:token', 'token-antigo')
    localStorage.setItem('@DevFinder:user', JSON.stringify(user))
    api.get.mockRejectedValueOnce({ response: { status: 401 } })
    const store = makeStore()

    await act(async () => hydrateAuth()(store.dispatch))

    expect(localStorage.getItem('@DevFinder:token')).toBeNull()
    expect(localStorage.getItem('@DevFinder:user')).toBeNull()
  })
})
