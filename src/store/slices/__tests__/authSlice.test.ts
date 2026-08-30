import reducer, { authActions, UserData } from '../authSlice'

const user = { _id: '1', name: 'Octocat', user: 'octocat' } as UserData

const initialState = {
  user: {} as UserData,
  message: {},
  isHydrated: false,
}

describe('authSlice', () => {
  it('setUser grava o user', () => {
    const state = reducer(initialState, authActions.setUser(user))

    expect(state.user).toEqual(user)
  })

  it('setUser atualiza o user', () => {
    const loggedIn = reducer(initialState, authActions.setUser(user))
    const updatedUser = { ...user, name: 'Octocat Updated' }

    const state = reducer(loggedIn, authActions.setUser(updatedUser))

    expect(state.user).toEqual(updatedUser)
  })

  it('signOut limpa o user', () => {
    const loggedIn = reducer(initialState, authActions.setUser(user))

    const state = reducer(loggedIn, authActions.signOut())

    expect(state.user).toEqual({})
  })

  it('setHydrated marca isHydrated', () => {
    const state = reducer(initialState, authActions.setHydrated(true))

    expect(state.isHydrated).toBe(true)
  })
})
