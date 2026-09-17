// Compartilhado por HomeFeed.tsx e UserTabs.tsx — os dois usam o mesmo estilo de aba do Radix
// Tabs (`.wrap-tabs-inline .tab-trigger` no styled-components original). Extraído numa única
// constante pra um ajuste futuro de estilo não exigir editar 5 strings JSX em 2 arquivos
// separadas (achado 4, code-review etapa 1).
export const TAB_TRIGGER_CLASSNAME =
  'bg-inherit text-primary-stronger rounded-none border-0 py-1.5 px-3 cursor-pointer data-[state=active]:text-primary-strong data-[state=active]:border-b-2 data-[state=active]:border-primary-strong';
