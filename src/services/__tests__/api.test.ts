import { handleResponseError } from '../api'

jest.mock('react-toastify', () => ({ toast: { error: jest.fn() } }))

describe('handleResponseError', () => {
  beforeEach(() => {
    // jsdom não implementa navegação real; sem isto o teste loga
    // "Not implemented: navigation" ao atribuir window.location.href
    // @ts-expect-error - jsdom location mock
    delete window.location
    window.location = { href: '/user/octocat' } as Location
  })

  it('rejeita a promise em 401 (regressão do bug do item #3)', async () => {
    const error = { response: { status: 401 } }

    await expect(handleResponseError(error as never)).rejects.toBe(error)
  })

  it('rejeita a promise nos demais status de erro', async () => {
    const error = { response: { status: 500 } }

    await expect(handleResponseError(error as never)).rejects.toBe(error)
  })
})
