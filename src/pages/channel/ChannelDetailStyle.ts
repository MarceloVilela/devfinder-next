import styled from 'styled-components';

const About = styled.ul`
  background-color: ${props => props.theme.backgroundWeakerer};
  border: 1px solid ${props => props.theme.backgroundWeakerer};
  border-radius: 15px;


li {
  display: flex;
  padding: 16px;
}

.avatar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar img {
  width: 100px;
  border-radius: 50px;
}

h3 {
  font-size: 24px;
  font-weight: 400;
  color: ${props => props.theme.foregroundStronger};
}

aside {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  justify-content: center;
  /*background-color: ${props => props.theme.backgroundWeakerer};
    border: 1px solid ${props => props.theme.backgroundWeakerer};*/
  padding-left: 16px;
  text-align: left;
  border-radius: 0 0 5px 5px;
}

aside>div {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 16px;
}

aside strong {
  font-size: 16px;
  color: ${props => props.theme.foregroundStronger};
}

aside p {
  font-size: 14px;
  line-height: 20px;
  color: ${props => props.theme.foregroundStrong};
  width: 100%;
}

aside svg {
  font-size: 32px;
  margin-left: 32px;
}

.buttons {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
}

.buttons button {
  height: 50px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.05);
  border: 0;
  border-radius: 4px;
  background: ${props => props.theme.primaryStronger};
  cursor: pointer;
  color: ${props => props.theme.foregroundStronger};
  display: flex;
  align-items: center;
  justify-content: center;
}

.buttons button span {
  margin-right: 16px;
}

.buttons button svg {
  font-size: 24px;
  color: white;
  margin: 0 16px;
}

.buttons button:hover svg {
  transform: translateY(-5px);
  transition: all .2s;
}

.buttons button:hover svg.dislike {
  transform: translateY(+5px);
  transition: all .2s;
}

@media (max-width: 1024px) {
  li {
    flex-direction: column;
  }

  aside {
    padding-left: 0;
    padding-top: 16px;
  }
}
`;

export default About;