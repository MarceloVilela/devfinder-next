import styled from 'styled-components'

export const UserThumb = styled.li`
& {
    border: 1px solid ${props => props.theme.backgroundWeakerer};
    border: none;
    border-radius: 10px;

    cursor: default !important;
}

&.card {
    background: ${props => props.theme.backgroundWeak};
    margin-bottom: 1rem;
}

&.card .avatar {
    margin-left: 1rem;
}

.avatar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar img {
    width: 48px;
    border-radius: 24px;
}

aside {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    background-color: ${props => props.theme.backgroundWeakerer};
    border: 1px solid ${props => props.theme.backgroundWeakerer};
    background: inherit;
    border: none;
    padding: 15px 20px;
    text-align: left;
    border-radius: 0 0 5px 5px;

}

aside header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

aside strong {
    font-size: 16px;
    color: ${props => props.theme.foregroundStronger};
}

aside small {
    display: block;
    overflow: hidden;
    
    font-size: 14px;
    color: ${props => props.theme.foregroundStronger};
    margin-top: 5px;
}

.buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
}

.buttons button {
    padding: 8px;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.05);
    border: 0;
    border-radius: 4px;
    background: #685394;
    cursor: pointer;
}

.buttons button svg {
    font-size: 16px;
    color: #FFF;
}

.buttons button:hover svg {
    transform: translateY(-5px);
    transition: all .2s;
}

.buttons button:hover svg.dislike {
  transform: translateY(+5px);
  transition: all .2s;
}

.main-container .empty {
    font-size: 32px;
    color: #c1bec7;
    font-weight: bold;
    margin-top: 300px;
}

.buttons.single {
    grid-template-columns: repeat(1, 1fr);
}

.buttons.single button {
    color: #FFF;
    display: flex;
    align-items: center;
    justify-content: center;
}

.buttons.single button  svg{
    margin-right: 10px;
}

&.placeholder .avatar div {
    background: #ccc;
    width: 48px;
    height: 48px;
    border-radius: 24px;
}

&.placeholder aside p {
    flex: 1;
    height: 16px;
    margin-bottom: 8px;
    border-radius: 6px;
    background: #ccc;
}`;
