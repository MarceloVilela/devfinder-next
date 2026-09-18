import { fetchJSON } from '../fetchJSON';

describe('fetchJSON', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('não passa signal nenhum quando timeoutMs não é informado', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    global.fetch = mockFetch as unknown as typeof fetch;

    await fetchJSON('/channels');

    const [, init] = mockFetch.mock.calls[0];
    expect(init.signal).toBeUndefined();
  });

  it('combina o signal do chamador com o do timeout em vez de sobrescrever (achado #4, code-review Etapa 2)', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    global.fetch = mockFetch as unknown as typeof fetch;

    const callerController = new AbortController();
    await fetchJSON('/channels', { signal: callerController.signal, timeoutMs: 5000 });

    const [, init] = mockFetch.mock.calls[0];
    expect(init.signal).toBeInstanceOf(AbortSignal);

    // o signal combinado deve abortar quando o do chamador aborta, mesmo sem o timeout disparar
    const aborted = new Promise((resolve) => init.signal.addEventListener('abort', resolve));
    callerController.abort();
    await aborted;
    expect(init.signal.aborted).toBe(true);
  });
});
