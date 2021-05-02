import styled from 'styled-components';
import { Container } from '../../components'

export const ContainerFullWidth = styled(Container)`
  @media screen and (max-width: 1024px) {
    & {
      width: 100%;
      margin-left: 0;
      margin-right: 0;
      padding-left: 0;
      padding-right: 0;
    }

    .container-edge-spacing, .react-tabs__tab-list, .paginate {
      padding-left: 16px;
      padding-right: 16px;
    }

    .react-tabs__tab-list {
      margin-bottom: 0;
    }
  }
`;

export const VideoList = styled.ul`
  display: grid;
  grid-gap: 1.5rem;
  grid-template-columns: repeat(1, 1fr);

  .bio {
    flex: 1;
  }

  @media (max-width: 599px) {
    & li.card {
      background-color: ${props => props.theme.backgroundWeak};
      padding: 1rem;
      margin-left: 1rem;
      margin-right: 1rem;
    }

    & li.card + li.card {
      margin-bottom: 1rem;
    }

    li.card .container-edge-spacing {
      padding-left: 0;
      padding-right: 0;
    }
  }

  @media (min-width: 600px) {
    & {
      grid-template-columns: repeat(2, 1fr);
      margin: 0 16px;
    }
  }

  @media (min-width: 900px) {
    & {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`;
