# 0001 — Motor de estilização: manter styled-components, Radix pontual

## Status

Aceito.

## Contexto

O app já migrou completamente para o App Router (`CLAUDE.md`, seção "Regra de renderização") e
usa `styled-components@6` com a transformação SWC (`next.config.js`) e um registry de SSR
(`app/registry.tsx`). O projeto-irmão `feednews-next` usa Tailwind + shadcn/ui, mas ainda está em
Pages Router e tem componentes duplicados em paralelo (`ArticleCard.tsx` e `ArticleCardShadcn.tsx`
coexistindo) — sinal de migração de estilização inacabada.

Nenhum critério de revisão exige uma stack de estilização específica; o que é exigido é resultado
(acessibilidade real, componentes com API de composição). Duas partes do app reimplementavam
acessibilidade de tablist à mão via `react-tabs`, sem verificação própria da lib quanto a
`role`/`aria-selected`/navegação por teclado.

## Decisão

- Manter **styled-components** como motor de estilização. Já está corretamente configurado para
  SSR e não é penalizado por nenhum critério do checklist de revisão.
- Adotar **Radix UI** (primitivos não estilizados, acessíveis por padrão) **pontualmente**, só
  onde reimplementar acessibilidade à mão é caro e propenso a erro: `@radix-ui/react-tabs` em
  `HomeFeed.tsx` e `UserTabs.tsx`, mantendo as classes CSS locais (`.wrap-tabs-inline` em
  `styles/GlobalStyle.ts`) — Radix Tabs entrega `role="tablist"`, navegação por seta do teclado e
  estado (`data-state="active"`) prontos.
- **Não adotar Tailwind/shadcn como sistema visual completo nesta etapa.**

## Alternativas consideradas

1. **Migração completa para Tailwind/shadcn** — rejeitada: reescrita de UI inteira, risco alto,
   sem exigência do checklist de revisão, e o projeto-irmão mostra concretamente o risco de uma
   migração de estilização parcial virar duplicação/dívida técnica visível.
2. **Um "provider" alternável entre dois motores de CSS em runtime** — rejeitada: significaria
   duas stacks de estilização vivendo no bundle ao mesmo tempo (mesma categoria de duplicação do
   item acima), abstração para um requisito hipotético quando o Git já resolve "voltar atrás" de
   graça.
3. **Manter como está, sem Radix** — rejeitada só para os dois usos de `react-tabs`: a lib não
   garante navegação por teclado/`aria-selected` própria, e o custo de adotar Radix ali é baixo
   (uma dependência pequena, desacoplada de estilização).

## Consequências

- `react-tabs` é removido do projeto (usos migrados para Radix Tabs ou, em `ChannelCategories.tsx`
  — onde a tablist é puramente decorativa e a navegação real é feita por um `<select>` — removido
  sem substituto, já que não havia tablist interativa visível).
- Se um redesign visual mais amplo for decidido no futuro, reabrir esta decisão nesta mesma pasta
  (`docs/decisions/`) em vez de migrar componente a componente sem registro.
