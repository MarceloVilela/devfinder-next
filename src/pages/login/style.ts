import styled from 'styled-components';

const LoginContainer = styled.div`
& {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.logo {
    font-family: 'Grenze Gotisch', cursive;
    text-align: center;
    color: ${props => props.theme.primary};
}

form {
    width: 100%;
    max-width: 300px;
    display: flex;
    flex-direction: column;

    height: 33vh;
    justify-content: space-evenly;
}

form input {
    margin-top: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
    height: 48px;
    padding: 0 20px;
    font-size: 16px;
    color: #666;
}

form input::placeholder {
    color: #999;
}

form button,
form a {
    margin-top: 10px;
    border: 0;
    border-radius: 4px;
    height: 48px;
    font-size: 16px;
    background: #9373d8;
    font-weight: bold;
    color: #FFF;
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;
}

form .login-visitor {
    background-color: #007bff;
}

form .login-social-github {
    background-color: #28a745;
}`;

export default LoginContainer;