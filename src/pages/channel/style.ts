import styled from 'styled-components';

export const ChannelContainer = styled.div`

.empty {
  font-size: 32px;
  color: #c1bec7;
  font-weight: bold;
  margin-top: 300px;
}

.channels-description {
  /* border: 1px solid white; */
  margin: 0 0 36px;
  color: #ccc;
  font-size: 16px;
}

.channels-description span {
  line-height: 21px;
}

.channels-description svg {
  font-size: 24px;
  color: #eee;
  margin: 0 0 -4px 16px;
}

select {
  margin-bottom: 24px;
  padding: 8px;
  background: inherit;
  border: 2px solid #9373d8;
  border-radius: 8px;
  color: #9373d8;
}

.react-tabs__tab-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 0.5rem;
  border: 0;
  display: none;
}

.react-tabs__tab {
  background: inherit;
  color: #999;
  border-radius: 0;
  border: 0;
  /**/
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #666;
  border-radius: 8px;
  height: 50px;
}

.react-tabs__tab--selected {
  color: #FFF;
  border: 2px solid #9373d8;
}

.categories {
  display: grid;
  grid-template-columns: repeat(auto-fill, 96px);
  grid-gap: 1rem;
  justify-content: center;
}

.categories li {
  flex-direction: column;
  align-items: center;
  height: inherit;
  text-align: center;
  padding: 0.2rem;
  justify-content: center;
  color: #ccc;
  border-radius: 10px;
}

.categories li svg {
  width: 40px;
  height: 40px;
  padding: 8px;
  border: 1px solid #3d3451;
  border-radius: 24px;
  background: #3d3451;
  /*font-size: 1.6rem;
  margin: 0 0.4rem;*/
}

.categories li.selected svg {
  background: #524473;
  border: 1px solid #524473;
}

.categories li p {
  height: 40px;
  line-height: 20px;
  overflow: hidden;
  /*margin-right: 0.4rem;*/
  font-size: 0.8rem;
}

@media (min-width: 900px) {
  .categories {
    grid-template-columns: repeat(1, 1fr);
  }
  .categories li {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    text-align: left;
    height: 48px;
    background: #3d3451;
    border-radius: 10px;
  }
  .categories li.selected {
    background: #524473;
  }
  .categories li p {
    line-height: 21px;
    height: auto;
    max-height: 40px;
    overflow: hidden;
  }
}

.channels {
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(1, 1fr);
}

@media (min-width: 768px) {
  .channels {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 992px) {
  .channels {
    grid-template-columns: repeat(3, 1fr);
  }
}
`;
