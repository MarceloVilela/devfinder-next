import { createGlobalStyle } from 'styled-components'
import { night, day } from './Theme'

export default createGlobalStyle`
/* Variáveis de CSS espelhando o Theme — necessário porque Server Components não conseguem ler
   o Context do ThemeProvider (limitação do React, não bug: Context nunca atravessa a fronteira
   Server/Client, mesmo com o Provider mais acima na árvore). Styled-components usados dentro de
   Server E Client Components leem essas variáveis em vez de props.theme.* — por isso os valores
   abaixo são estáticos (não vêm de props.theme), presentes desde o primeiro HTML enviado pelo
   servidor. Quem decide qual regra vale é o atributo data-theme no <html>, escrito por um script
   bloqueante em app/layout.tsx antes do primeiro paint (ver Ponto 3 do plano de UI/UX) — não o
   ThemeProvider, que hidrata depois. Isso elimina o flash de tema incorreto no primeiro paint. */
:root {
  --color-primary: ${night.primary};
  --color-primary-strong: ${night.primaryStrong};
  --color-primary-stronger: ${night.primaryStronger};
  --color-background-weakerer: ${night.backgroundWeakerer};
  --color-background-weak: ${night.backgroundWeak};
  --color-background: ${night.background};
  --color-foreground: ${night.foreground};
  --color-foreground-strong: ${night.foregroundStrong};
  --color-foreground-stronger: ${night.foregroundStronger};
}

:root[data-theme='light'] {
  --color-background-weakerer: ${day.backgroundWeakerer};
  --color-background-weak: ${day.backgroundWeak};
  --color-background: ${day.background};
  --color-foreground: ${day.foreground};
  --color-foreground-strong: ${day.foregroundStrong};
  --color-foreground-stronger: ${day.foregroundStronger};
}

* {
  margin: 0;
  padding: 0;
  outline: 0;
  box-sizing: border-box;
}

html, body, #root, #__next {
  height: 100%;
}

body {
  background: var(--color-background);
}

body, input, button {
  font-family: Arial, Helvetica, sans-serif;
}

a {
  text-decoration: none;
}

a img:hover {
  opacity: 0.7;
}

a svg:hover {
  opacity: 0.7;
}

main {
  max-width: 980px;
  margin: 0 auto;
  padding: 20px 0;
  text-align: center;
}

.list-flex-row > *, .list-flex-column > * {
  cursor: pointer;
}

.list-flex-row > *:hover, .list-flex-column > *:hover {
  opacity: 0.7;
}

.list-flex-row, .list-flex-column {
  list-style: none;
  margin-top: 0;
}

.list-flex-row li {
  display: flex;
  flex-direction: row;
  /*border: 1px solid #ccc;*/
}

.list-flex-column li {
  display: flex;
  flex-direction: column;
  /*border: 1px solid #ccc;*/
}

.wrap-tabs-inline .tab-list {
  display: flex;
  border: 0;

  list-style: none;
}

.wrap-tabs-inline .tab-trigger {
  background: inherit;
  color: var(--color-primary-stronger);
  border-radius: 0;
  border: 0;

  padding: 6px 12px;
  cursor: pointer;
}

.wrap-tabs-inline .tab-trigger[data-state='active'] {
  color: var(--color-primary-strong);
  border-bottom: 2px solid var(--color-primary-strong);
}`;
