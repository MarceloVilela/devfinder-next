# 0004 — Dependabot desligado; atualização de dependências é manual

## Status

Aceito (v5, 2026-10-31). Reverte o achado L3 da v5 ("dependências com bump pendente e sem
automação"), que pedia Dependabot. Reabrir se o projeto ganhar mais de um mantenedor ou se a
cadência manual abaixo deixar de ser cumprida.

## Contexto

O Dependabot foi configurado na Etapa 1 da v5 (`.github/dependabot.yml`: `npm` e
`github-actions`, semanal, minor/patch agrupados). No primeiro ciclo abriu cerca de dez PRs de uma
vez, entre eles majors da stack central:

- `eslint-plugin-react-hooks` 5 → 7: o plugin novo reprova `Header/index.tsx`
  (`react-hooks/set-state-in-effect`) e derrubou o build do **preview** na Vercel (o deploy de
  produção não foi afetado).
- `next` 15 → 16 e `eslint-config-next` 15 → 16: migração de framework, não bump.
- `react-icons` 4 → 5 e três ações do workflow (`checkout`, `setup-node`, `pnpm/action-setup`).

Foi preciso um segundo ajuste no mesmo arquivo (`ignore` de majors de `next`, `eslint-config-next`,
`react`, `react-dom` e `eslint-plugin-react-hooks`) para conter o ruído. A fila que ficou aberta
(grupo minor/patch, `react-icons` 5 e as três ações) foi aplicada de uma vez à mão, no mesmo PR
que desliga o Dependabot (`tsc`, `lint`, `test`, `build` e `audit` verdes). O H1 da mesma rodada, uma vulnerabilidade crítica no `next`, foi encontrado por
`pnpm audit`, não por Dependabot.

## Decisão

Desligar o Dependabot de **version updates** e tratar a atualização de dependências como tarefa
manual e planejada.

- Removido `.github/dependabot.yml`. Desligar também em *Settings → Code security → Dependabot
  version updates* é passo manual no GitHub, fora deste repositório.
- **Controle que substitui:** o job `audit` do CI (`pnpm audit --prod --audit-level=high`) segue
  bloqueando `high` e `critical`. Os **alertas e security updates** do Dependabot são um recurso à
  parte (não dependem do `dependabot.yml`) e podem continuar ligados nas configurações do GitHub.
- **Cadência manual:** rodar `pnpm outdated` no fechamento de cada rodada de melhorias (vN) e antes
  de qualquer release; aplicar minor/patch juntos em um PR; majors da stack central
  (`next`, `react`, `react-dom`, `eslint*`) só como item planejado, com migração e teste, nunca
  como bump isolado.

## Alternativas consideradas

- **Manter o Dependabot com `ignore` de majors e agrupamento** (estado imediatamente anterior):
  reduz o ruído, mas ainda abre PRs semanais de um projeto com um único mantenedor, e o `ignore`
  vira lista que precisa ser mantida. Rejeitada por escolha do mantenedor.
- **Renovate ou outra automação:** mesmo trade-off de volume, mais uma ferramenta para configurar.

## Consequências

- Dependências podem ficar defasadas entre uma rodada e outra; o risco de segurança é coberto pelo
  `audit` bloqueante no CI, o de defasagem pela cadência manual.
- Um review que levante "sem automação de dependências" tem aqui a decisão, o motivo e o controle
  compensatório. Não é garantia contra a crítica, só o registro de que foi uma escolha consciente.
- Se a cadência manual não for cumprida, a defasagem volta a aparecer em `pnpm outdated` e o
  Dependabot pode ser religado (ou trocado por Renovate) revertendo este ADR.
