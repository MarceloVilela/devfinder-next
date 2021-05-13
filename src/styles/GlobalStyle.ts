import { createGlobalStyle } from 'styled-components'
import { ThemeType } from '../hooks/index'

export default createGlobalStyle<{ theme: ThemeType }>`
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
  background: ${props => props.theme.background};
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

.wrap-tabs-inline .react-tabs__tab-list {
  display: flex;
  border: 0;

  list-style: none;
}

.wrap-tabs-inline .react-tabs__tab {
  background: inherit;
  color: ${props => props.theme.primaryStronger};
  border-radius: 0;
  border: 0;

  padding: 6px 12px;
  cursor: pointer;
}

.wrap-tabs-inline .react-tabs__tab--selected {
  color: ${props => props.theme.primaryStrong};
  border-bottom: 2px solid ${props => props.theme.primaryStrong};
}`;
