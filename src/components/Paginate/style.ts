import styled from 'styled-components';

export const PaginateList = styled.ul`
&.paginate {
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
}

li {
    background-color: ${props => props.theme.primaryStronger};
    padding: 5px 10px;
    margin-right: 10px;
    cursor: pointer;
    border-radius: 3px;
    color: #ccc;
}

li:hover {
    opacity: 0.7;
}

li.selected {
    font-weight: bold;
    color: #fff;
}

.begin, .end {
    opacity: 0.7;
}`;
