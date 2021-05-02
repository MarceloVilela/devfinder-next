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
  text-align: center;
  display: flex;
  align-content: space-between;
}

@media (max-width: 1024px) {
  section {
    padding: 22px 22px 0 22px;
    padding: 1rem 1rem 1rem 1rem;
  }
}

section>a {
  display: flex;
  flex: 5;
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
}`;

export default Wrapper;