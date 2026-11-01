import RefreshPage from '../page'

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))
jest.mock('../_components/RefreshClient', () => ({
  __esModule: true,
  default: () => null,
}))

const TOKEN = 'token-de-teste'
const searchParams = (token?: string) => Promise.resolve(token === undefined ? {} : { token })

// Gate de acesso de `/video/refresh` (A3, v4): ferramenta interna sem sistema de papéis — 404 real
// quando o token da URL não confere com `VIDEO_REFRESH_TOKEN`.
describe('/video/refresh (gate por token)', () => {
  const original = process.env.VIDEO_REFRESH_TOKEN

  afterEach(() => {
    if (original === undefined) delete process.env.VIDEO_REFRESH_TOKEN
    else process.env.VIDEO_REFRESH_TOKEN = original
  })

  it('token correto renderiza o dashboard', async () => {
    process.env.VIDEO_REFRESH_TOKEN = TOKEN

    const result = await RefreshPage({ searchParams: searchParams(TOKEN) })

    expect(result).toBeTruthy()
  })

  it.each([
    ['token errado', 'outro-token'],
    ['sem token na URL', undefined],
    ['token vazio', ''],
  ])('%s → 404', async (_label, token) => {
    process.env.VIDEO_REFRESH_TOKEN = TOKEN

    await expect(RefreshPage({ searchParams: searchParams(token) })).rejects.toThrow('NEXT_NOT_FOUND')
  })

  it('VIDEO_REFRESH_TOKEN não configurada → 404 pra todos, mesmo com token na URL', async () => {
    delete process.env.VIDEO_REFRESH_TOKEN

    await expect(RefreshPage({ searchParams: searchParams('qualquer') })).rejects.toThrow('NEXT_NOT_FOUND')
  })
})
