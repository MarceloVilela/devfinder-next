import styled from 'styled-components';

const Wrapper = styled.footer`
background: #222;
color: #ccc;

a, p {
  color: #ccc;
  cursor: pointer;
}

a + a{
  margin-left: 16px;
}

&>div{
  max-width: 980px;
  margin: 0 auto;
  padding: 16px 0;
  display: flex;
  justify-content: space-between;
  text-align: center;
}

@media screen and (max-width: 1024px) {
  & { 
    max-width: 100%;
    width: 100%;
    padding: 32px 16px;
    /* header fixed */
    padding-top: 50px; 
  }
}`;

export default Wrapper;
