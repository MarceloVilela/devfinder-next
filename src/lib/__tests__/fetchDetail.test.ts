import { fetchDetail } from '../fetchDetail';
import { COLD_START_TIMEOUT_MS, HTTPError } from '../fetchJSON';

describe('fetchDetail', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('busca sem cache de ISR e com o timeout de cold start (não o de 5s do padrão)', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ _id: '1' }) });
    global.fetch = mockFetch as unknown as typeof fetch;
    const timeoutSpy = jest.spyOn(AbortSignal, 'timeout');

    await expect(fetchDetail('/devs/ok-1')).resolves.toEqual({ _id: '1' });

    const [, init] = mockFetch.mock.calls[0];
    expect(init.cache).toBe('no-store');
    expect(timeoutSpy).toHaveBeenCalledWith(COLD_START_TIMEOUT_MS);
  });

  it('dado ausente (200 + null) resolve null — a página decide virar notFound()', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => null }) as unknown as typeof fetch;

    await expect(fetchDetail('/devs/ausente-1')).resolves.toBeNull();
  });

  it('erro HTTP do backend rejeita com HTTPError (vira error.tsx, não "não encontrado")', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 }) as unknown as typeof fetch;

    await expect(fetchDetail('/devs/http-1')).rejects.toBeInstanceOf(HTTPError);
  });

  it('falha de rede rejeita (vira error.tsx, não "não encontrado")', async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError('fetch failed')) as unknown as typeof fetch;

    await expect(fetchDetail('/devs/rede-1')).rejects.toThrow('fetch failed');
  });

  // Não coberto de propósito: a dedup de `generateMetadata` + página (2 chamadas → 1 request) vem do
  // `cache()` do React, que só memoiza no ambiente de Server Component. Sob Jest/jsdom ele é um
  // passa-direto (verificado: 2 chamadas com o mesmo path = 2 fetches), então um teste aqui não
  // provaria nada. A garantia é o comentário em `fetchDetail.ts` + a checagem manual (1 request ao
  // backend por carregamento do detalhe).
});
