import reducer, { themeActions } from '../themeSlice'

const initialState = {
  alias: 'dark' as const,
  isHydrated: false,
}

describe('themeSlice', () => {
  it('setAlias troca o alias explicitamente', () => {
    const state = reducer(initialState, themeActions.setAlias('light'))

    expect(state.alias).toBe('light')
  })

  it('toggleAlias alterna entre dark e light', () => {
    const light = reducer(initialState, themeActions.toggleAlias())
    expect(light.alias).toBe('light')

    const dark = reducer(light, themeActions.toggleAlias())
    expect(dark.alias).toBe('dark')
  })

  it('setHydrated marca isHydrated', () => {
    const state = reducer(initialState, themeActions.setHydrated(true))

    expect(state.isHydrated).toBe(true)
  })
})
