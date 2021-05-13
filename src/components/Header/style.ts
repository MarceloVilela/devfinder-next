import styled from 'styled-components';

const Wrapper = styled.header`
/* fixed */
position: fixed;
/*margin-top: -22px;*/
top: 0;
width: 100%;
opacity: 0.95;

background: #222;
z-index: 9;

section {
  max-width: 980px;
  margin: 0 auto;
  padding: 24px 0 0 0;
  padding: 8px 0;
  text-align: center;
  display: flex;
  align-content: space-between;

  flex-wrap: wrap;
}

section > a {
  display: flex;
  /*flex: 1;*/
}

section > div {
  display: flex;
  flex: 2;
  margin: 0 16px 0 32px;
}

section > div > div {
  flex: 1;
}

nav a {
  position: relative;
}

nav a > div {
  position: absolute;
  width: 300px;
  right: 0;
  top: 40px;
}

nav a div {
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.primary};
  outline-color: ${props => props.theme.primary};
  border-color: ${props => props.theme.primary};

  text-align: left;

  &:hover {
    outline-color: ${props => props.theme.primary};
    border-color: ${props => props.theme.primary};
  }
}

section nav {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
}

section nav a {
  text-decoration: none;
  color: #ccc;
  margin-left: 16px;
  font-size: 0.8rem
}

section nav svg {
  font-size: 20px;
}

.logo {
  font-family: 'Grenze Gotisch', cursive;
  font-size: 1.5em;
  text-align: center;

  color: ${props => props.theme.primary};
}

@media (max-width: 1024px) {
  section {
    padding: 22px 22px 0 22px;
    padding: 1rem 1rem 1rem 1rem;
  }

  section > a {
    order: 1;
    flex: 1;
  }

  section > div {
    order: 3;
    min-width: 100%;
    width: 100%;
    margin: 8px 0 0 0;
  }

  section > nav {
    order: 2;
    flex: 2;
  }

  section > nav a {
    display: flex;
    align-items: center;
    flex-flow: column;
  }

  section > nav a span {
    margin-top: -4px;
  }
}
`;

export default Wrapper;