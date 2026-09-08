import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getSessionToken, fetchSessionJSON, redirectIfSessionExpired } from '../fetchSessionJSON';
import { HTTPError } from '../fetchJSON';

jest.mock('next/headers', () => ({ cookies: jest.fn() }));
jest.mock('next/navigation', () => ({ redirect: jest.fn() }));

const mockedCookies = cookies as jest.Mock;

describe('getSessionToken', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('retorna o valor do cookie de sessão quando presente', async () => {
    mockedCookies.mockResolvedValue({
      get: jest.fn((name: string) => (name === 'devfinder_token' ? { value: 'abc123' } : undefined)),
    });

    await expect(getSessionToken()).resolves.toBe('abc123');
  });

  it('retorna undefined quando não há cookie de sessão (visitante)', async () => {
    mockedCookies.mockResolvedValue({
      get: jest.fn(() => undefined),
    });

    await expect(getSessionToken()).resolves.toBeUndefined();
  });
});

describe('fetchSessionJSON', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('envia o token como header Cookie e cache: no-store', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    global.fetch = mockFetch as unknown as typeof fetch;

    await fetchSessionJSON('/likes/devs', 'abc123');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/likes/devs'),
      expect.objectContaining({
        cache: 'no-store',
        headers: { Cookie: 'devfinder_token=abc123' },
      }),
    );
  });

  it('propaga erro quando a resposta não é ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 401 }) as unknown as typeof fetch;

    await expect(fetchSessionJSON('/likes/devs', 'abc123')).rejects.toThrow();
  });
});

describe('redirectIfSessionExpired', () => {
  const mockedRedirect = redirect as unknown as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('redireciona pro /login quando o erro é HTTPError 401 (cookie presente mas inválido/expirado)', () => {
    redirectIfSessionExpired(new HTTPError(401, '/likes/devs'));

    expect(mockedRedirect).toHaveBeenCalledWith('/login');
  });

  it('não redireciona pra outros status HTTP', () => {
    redirectIfSessionExpired(new HTTPError(500, '/likes/devs'));

    expect(mockedRedirect).not.toHaveBeenCalled();
  });

  it('não redireciona pra erro que não é HTTPError (ex.: falha de rede)', () => {
    redirectIfSessionExpired(new Error('network error'));

    expect(mockedRedirect).not.toHaveBeenCalled();
  });
});
