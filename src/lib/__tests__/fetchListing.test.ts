import { fetchListing, LISTING_COLD_START_TIMEOUT_MS } from '../fetchListing';
import { DEFAULT_FETCH_TIMEOUT_MS } from '../fetchJSON';

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

  it('loga a falha e propaga o erro (review-human.md #1 — não engole mais pra não envenenar cache do ISR)', async () => {
    console.error = jest.fn();
    global.fetch = jest.fn().mockRejectedValue(new Error('timeout')) as unknown as typeof fetch;

    await expect(fetchListing('/channels')).rejects.toThrow('timeout');
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('/channels'), expect.any(Error));
  });

  it('usa DEFAULT_FETCH_TIMEOUT_MS quando nenhum timeoutMs é informado', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ docs: [] }) }) as unknown as typeof fetch;
    const timeoutSpy = jest.spyOn(AbortSignal, 'timeout');

    await fetchListing('/channels');

    expect(timeoutSpy).toHaveBeenCalledWith(DEFAULT_FETCH_TIMEOUT_MS);
    timeoutSpy.mockRestore();
  });

  it('repassa um timeoutMs customizado pra fetchJSON (ex. LISTING_COLD_START_TIMEOUT_MS de `/`, `/user`, `/channel`)', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ docs: [] }) }) as unknown as typeof fetch;
    const timeoutSpy = jest.spyOn(AbortSignal, 'timeout');

    await fetchListing('/channels', { timeoutMs: LISTING_COLD_START_TIMEOUT_MS });

    expect(timeoutSpy).toHaveBeenCalledWith(LISTING_COLD_START_TIMEOUT_MS);
    timeoutSpy.mockRestore();
  });
});
