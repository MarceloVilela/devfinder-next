import { renderHook, act } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

import { useAuth, UserData } from '../auth'
import authReducer from '../../store/slices/authSlice'

const user = { _id: '1', name: 'Octocat', user: 'octocat' } as UserData

describe('useAuth', () => {
  afterEach(() => localStorage.clear())

  function renderUseAuth() {
    // store isolada por teste — a store do Redux é singleton por natureza,
    // sem isso um teste herdaria o estado deixado pelo anterior
    const testStore = configureStore({ reducer: { auth: authReducer } })

    return renderHook(() => useAuth(), {
      wrapper: ({ children }) => <Provider store={testStore}>{children}</Provider>,
    })
  }

  it('persiste token e user em localStorage após socialAuthCallback', () => {
    const { result } = renderUseAuth()

    act(() => result.current.socialAuthCallback({ token: 'abc123', user }))

    expect(localStorage.getItem('@DevFinder:token')).toBe('abc123')
    expect(JSON.parse(localStorage.getItem('@DevFinder:user')!)).toEqual(user)
  })

  it('limpa localStorage em signOut', () => {
    const { result } = renderUseAuth()

    act(() => result.current.socialAuthCallback({ token: 'abc123', user }))
    act(() => result.current.signOut())

    expect(localStorage.getItem('@DevFinder:token')).toBeNull()
    expect(localStorage.getItem('@DevFinder:user')).toBeNull()
  })
})
