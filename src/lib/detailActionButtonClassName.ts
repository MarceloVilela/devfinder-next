// Compartilhado pelos botões de ação das 3 páginas de detalhe (video/[slug], user/[slug],
// channel/[slug] não usa, mas os dois primeiros repetem literalmente). Extraído numa única
// constante pra um ajuste futuro de estilo não exigir editar 3-4 strings JSX quase idênticas em
// 2 arquivos separados (achado do fechamento v4 — mesmo padrão de `tabTriggerClassName.ts`,
// achado 4 do code-review etapa 1). Não inclui a cor de fundo: o botão "Acessar" de
// `video/[slug]` usa vermelho via `style` inline (marca do YouTube) em vez de
// `bg-primary-stronger` — cada call site decide a cor.
export const DETAIL_ACTION_BUTTON_CLASSNAME =
  'h-[50px] shadow-[0_2px_2px_0_rgba(0,0,0,0.05)] border-0 rounded-[4px] cursor-pointer text-white flex items-center justify-center w-[270px] mb-6';
