import styled from 'styled-components';

const About = styled.article`
display: flex;
flex-direction: column;
width: 270px;
align-items: center;
margin: 0 auto;

.thumb {
  border: 0;
  border-radius: 1rem;
}

.thumb, p, .buttons button {
  width: 270px;
  margin-bottom: 24px;
}

p {
  color: ${props => props.theme.foregroundStronger}
}

.buttons {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.buttons button {
  height: 50px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.05);
  border: 0;
  border-radius: 4px;
  background: ${props => props.theme.primaryStronger};
  cursor: pointer;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.buttons button svg {
  font-size: 24px;
  color: white;
  margin: 0 16px;
  width: 32px;
}

.buttons button span {
  flex: 1;
  text-align: left;
  margin-left: 24px;
  text-transform: uppercase;
  font-weight: bold;
}
`;

export default About;