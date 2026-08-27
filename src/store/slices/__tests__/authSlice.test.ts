import reducer, { authActions, UserData } from '../authSlice'

const user = { _id: '1', name: 'Octocat', user: 'octocat' } as UserData

const initialState = {
  token: null,
  user: {} as UserData,
  message: {},
  isHydrated: false,
}

describe('authSlice', () => {
  it('setCredentials grava token e user', () => {
    const state = reducer(initialState, authActions.setCredentials({ token: 'abc123', user }))

    expect(state.token).toBe('abc123')
    expect(state.user).toEqual(user)
  })

  it('setUser atualiza só o user, mantendo o token', () => {
    const loggedIn = reducer(initialState, authActions.setCredentials({ token: 'abc123', user }))
    const updatedUser = { ...user, name: 'Octocat Updated' }

    const state = reducer(loggedIn, authActions.setUser(updatedUser))

    expect(state.user).toEqual(updatedUser)
    expect(state.token).toBe('abc123')
  })

  it('signOut limpa token e user', () => {
    const loggedIn = reducer(initialState, authActions.setCredentials({ token: 'abc123', user }))

    const state = reducer(loggedIn, authActions.signOut())

    expect(state.token).toBeNull()
    expect(state.user).toEqual({})
  })

  it('setHydrated marca isHydrated', () => {
    const state = reducer(initialState, authActions.setHydrated(true))

    expect(state.isHydrated).toBe(true)
  })
})
