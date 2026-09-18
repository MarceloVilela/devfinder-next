import { fetchListing } from '../fetchListing';

describe('fetchListing', () => {
  const originalFetch = global.fetch;
  const originalConsoleError = console.error;

  afterEach(() => {
    global.fetch = originalFetch;
    console.error = originalConsoleError;
    jest.clearAllMocks();
  });

  it('retorna os dados quando o fetch é bem-sucedido', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ docs: [] }),
    }) as unknown as typeof fetch;

    await expect(fetchListing('/channels')).resolves.toEqual({ docs: [] });
  });

  it('retorna null e loga a falha em vez de propagar o erro (achado #3, code-review Etapa 2)', async () => {
    console.error = jest.fn();
    global.fetch = jest.fn().mockRejectedValue(new Error('timeout')) as unknown as typeof fetch;

    await expect(fetchListing('/channels')).resolves.toBeNull();
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('/channels'), expect.any(Error));
  });
});
