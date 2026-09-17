# 0002 — CSS perdido em streaming SSR: migrar para Tailwind, sem shadcn

> **Escopo desta migração: 1:1 do visual atual, sem redesign.** Troca de motor de CSS
> (styled-components → Tailwind), mantendo layout, composição e identidade visual (`Theme.ts`)
> como estão. Inspiração externa de UI/UX (`../references__.md`) é material pra um eventual
> redesign futuro, não pra aplicar durante esta etapa — se alguma rota virar redesign de fato,
> isso merece ADR própria antes de aplicar, não decisão item a item no meio da migração.

## Status

Aceito. Condensa três decisões tomadas na mesma rodada (2026-09-17), registradas antes em
`0002`/`0003`/`0004-styling-stack.md` separados — mesmo tema, mesmo dia, decisão final
reabrindo a anterior duas vezes seguidas; condensado aqui num histórico único para não deixar
três ADRs sequenciais se revertendo entre si.

## Contexto

Teste manual logado (2026-09-17, `zrevisao260917__.md`, arquivo local não versionado) achou
dois bugs de CSS perdido em runtime, ambos com a mesma superfície (regra do
`styled-components` ausente no cliente apesar do DOM do SSR estar correto), mas causas raiz
diferentes:

1. **Mismatch de `useId()` do Radix Tabs dentro de `<Suspense>`** — o React reserva IDs de
   forma diferente entre o que é resolvido durante o streaming SSR e o que é consumido na
   hidratação do cliente, disparando reconciliação que descartava o CSS do conteúdo dentro das
   abas. **Corrigido** (PR #9, `e66c219`): `<Suspense>` removido de `Subs`/`UserLiked`/
   `UserDisliked`, dado pessoal resolvido em `Promise.all` com o dado público.
2. **Perda esporádica de CSS em `/` e `/video`** (não em `/user`) — páginas com 30-60 cards
   geram múltiplas tags `<style data-styled>` na resposta SSR (`app/registry.tsx`, via
   `useServerInsertedHTML` + `stylesheet.instance.clearTag()` a cada flush, o padrão
   oficialmente recomendado pelo Next.js); em streaming fragmentado o suficiente, o cliente
   às vezes não absorve todas as tags durante a hidratação, e a perda é não-determinística
   (varia entre execuções qual regra falta). Sem causa atribuível a este projeto: `registry.tsx`
   foi comparado caractere por caractere com o exemplo oficial do Next.js
   (`vercel/next.js/examples/with-styled-components`) e são idênticos. É um problema de fundo já
   reportado e fechado sem solução pelos mantenedores do `styled-components`:
   [styled-components#3924](https://github.com/styled-components/styled-components/issues/3924)
   ("hydration error recovery is a React-level concern").

Tentativa descartada durante a investigação: remover `clearTag()` do registry (emitir sempre o
snapshot acumulado, sem limpar entre flushes) — piorou o problema (42 tags `<style>`
duplicadas na resposta SSR, sem resolver a perda no cliente). Revertida.

Este achado foi levantado de novo na avaliação externa v4 (`reactjs/devfinder-next.md`, achado
A1) com a mesma conclusão técnica, acrescentando um ponto de processo: o achado já existia
desde 2026-09-17 só num arquivo de rascunho `git`-ignorado (`zrevisao260917__.md`), nunca
promovido para a documentação rastreada do projeto.

A pergunta "migrar de CSS-in-JS para Tailwind" foi então avaliada **duas vezes** na mesma
rodada:

- **Primeira resposta**: não migrar nesta etapa — sem solução de causa raiz disponível no nível
  de `styled-components`/Next.js (issue upstream fechada sem fix), e migração de stack seria
  remédio desproporcional a um sintoma esporádico e não bloqueante, repetindo o risco já
  registrado em `0001-styling-stack.md` (o projeto-irmão `feednews-next` demonstra o custo de
  uma migração de estilização parcial: componentes duplicados coexistindo). Decisão inicial:
  só documentar o bug como limitação conhecida (README/CLAUDE.md), sem resolver.
- **Segunda resposta** (mesmo dia, ao planejar a execução da Etapa 1 do plano de execução v4):
  reabrir e reverter — o dono do projeto decidiu resolver agora em vez de adiar pela terceira
  vez (ver `reactjs/improvements/v4/devfinder-next/1-plano-migracao-tailwind.md`), para não
  virar o padrão de drift de decisão nunca revalidada que
  `0como-evitar-bola-de-neve.md` descreve como categoria 3.

Encadeada a essa reversão, surgiu uma pergunta adjacente: já que a migração usaria Radix por
baixo dos panos onde Tailwind entra, fazia sentido adotar **shadcn/ui** (Radix + Tailwind + CVA,
distribuído como código copiado para o repo) junto? `criterios-revisor-senior-2026.md` não
exige biblioteca de componentes específica — exige resultado (item 10: navegação por teclado,
foco gerenciado, `aria-live`; item 11: API por composição/slots). Radix puro, já adotado
pontualmente em `0001`, entrega os dois sem precisar de shadcn por cima; o único uso atual de
Radix no projeto é `Tabs`, tornando o ferramental de shadcn (CLI própria, `class-variance-
authority`, dezenas de componentes pré-estilizados) desproporcional ao escopo real.

## Decisão

- **Migrar de styled-components para Tailwind CSS.** Remove `app/registry.tsx` (registry de
  SSR) e `styles/styled.d.ts` — sem `<style>` injetado via JS para perder durante streaming,
  o achado 2 é eliminado pela raiz, não só mitigado. Plano de execução:
  `reactjs/improvements/v4/devfinder-next/1-plano-migracao-tailwind.md`.
- **Registrar o achado como resolvido por migração de stack** no README ("Limitações
  conhecidas") — não mais como limitação em aberto, já que a causa deixa de existir.
- **Manter Radix pontual** (`@radix-ui/react-tabs`, decisão de `0001` inalterada) e **manter o
  mecanismo de CSS vars `--color-*` + atributo `data-theme`** para evitar flash de tema
  incorreto — `tailwind.config` passa a referenciar essas variáveis em vez de reintroduzir
  paleta hardcoded.
- **Não adotar shadcn/ui.** Classes utilitárias Tailwind aplicadas diretamente nos slots do
  Radix cru. Revisitar só se aparecer necessidade concreta de primitivo complexo hoje
  reimplementado à mão (dropdown, dialog, combobox) — não adotar de forma antecipada.

## Alternativas consideradas

1. **Adiar a migração de novo (manter a resposta inicial)** — rejeitada: seria a terceira
   rodada reabrindo a mesma pergunta sem decidir; risco de virar drift de decisão.
2. **Migração parcial/incremental de styled-components para Tailwind, coexistindo por um
   tempo** — rejeitada, mesmo motivo de `0001`: `feednews-next` demonstra concretamente o custo
   desse caminho (`ArticleCard.tsx`/`ArticleCardShadcn.tsx` duplicados).
3. **Adotar shadcn/ui junto da migração** — rejeitada: não adiciona motor de acessibilidade
   novo sobre o que Radix puro já entrega; ferramental desproporcional ao único uso atual
   (Tabs); mesmo precedente de risco do `feednews-next`.
4. **Lazy-load da aba "Inscrições"/"Favoritos"** (renderizar só a aba ativa no SSR) — cogitada
   como mitigação parcial do achado 2 sem trocar de motor de CSS; descartada como caminho
   principal porque não elimina a causa (só reduz a chance de streaming fragmentado o
   suficiente para disparar o bug), superada pela decisão de migrar.

## Consequências

- Achado A1/achado 2 (perda esporádica de CSS) **eliminado pela raiz** com a migração, não só
  documentado.
- Diff grande e transversal (~17 arquivos `style.ts` + infraestrutura) — ver plano de execução
  para ordem, verificação por rota e risco de regressão visual.
- Nenhuma dependência nova além de Tailwind (sem CVA/shadcn CLI).
- Se um redesign visual mais amplo, ou necessidade concreta de primitivo complexo, for
  decidido depois, reabrir nesta mesma pasta citando esta ADR — mesma regra que `0001` já
  deixava registrada.

## Desvios do escopo 1:1 (registrados durante a execução)

- **Ícones do nav do Header, desktop**: o layout original (styled-components) só empilhava
  ícone acima do texto dentro de `@media (max-width: 1024px)` — no desktop, ícone e texto
  ficavam lado a lado. Durante a execução da Etapa 1, o dono do projeto pediu explicitamente que
  o header desktop também mostrasse ícone em cima do texto, centralizado (referência: ícones do
  rodapé do YouTube) — `src/components/Header/style.css`, seletor
  `.header-wrapper section nav a`. É o único desvio visual intencional desta rodada frente ao
  "1:1 do visual atual, sem redesign" declarado no topo deste documento; registrado aqui (achado
  de code-review, `code-review-etapa-1.md`) por não ter sido documentado no momento da mudança.
