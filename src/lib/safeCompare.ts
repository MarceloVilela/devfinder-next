import { createHash, timingSafeEqual } from 'crypto';

// Comparação de segredo (token de URL, header de API) resistente a timing attack — `!==`/`===`
// em string sai assim que encontra o primeiro byte diferente, o que em teoria permite inferir o
// segredo byte a byte pela latência da resposta. `timingSafeEqual` exige buffers do mesmo
// tamanho (lança exceção se não forem), então normaliza os dois lados por hash de tamanho fixo
// antes de comparar, em vez de comparar o tamanho original (que também vazaria informação).
// Extraído pra reuso — próxima rota interna gated por capability URL usa isto em vez de
// reimplementar `!==` inline (achado do fechamento v4, `video/refresh/page.tsx`).
export function safeCompare(a: string, b: string): boolean {
  const hashA = createHash('sha256').update(a).digest();
  const hashB = createHash('sha256').update(b).digest();
  return timingSafeEqual(hashA, hashB);
}
