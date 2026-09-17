// Merge de className condicional — mesmo padrão repetido em vários componentes migrados de
// styled-components pra Tailwind (Container, video/style.tsx). Extraído numa função
// compartilhada em vez de duplicar o one-liner (achado 5, code-review etapa 1).
export function classNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}
