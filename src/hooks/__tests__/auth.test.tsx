import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth, UserData } from '../auth'

const user = { _id: '1', name: 'Octocat', user: 'octocat' } as UserData

describe('useAuth', () => {
  afterEach(() => localStorage.clear())

  it('persiste token e user em localStorage após socialAuthCallback', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    act(() => result.current.socialAuthCallback({ token: 'abc123', user }))

    expect(localStorage.getItem('@DevFinder:token')).toBe('abc123')
    expect(JSON.parse(localStorage.getItem('@DevFinder:user')!)).toEqual(user)
  })

  it('limpa localStorage em signOut', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    act(() => result.current.socialAuthCallback({ token: 'abc123', user }))
    act(() => result.current.signOut())

    expect(localStorage.getItem('@DevFinder:token')).toBeNull()
    expect(localStorage.getItem('@DevFinder:user')).toBeNull()
  })
})
