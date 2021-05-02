import styled from 'styled-components';

export const Thumb = styled.li`
& {
  /*border: 1px solid #666;*/
  border-radius: 10px;
  cursor: default;
}

.thumb {
  display: flex;
  justify-content: center;
  align-items: center;
}

.thumb img {
  width: 100%;
}

footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  margin-top: 1rem;
  text-align: left;
}

.avatar img {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 0.5rem;
}

footer strong {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 16px;
  line-height: 16px;
  max-height: 32px;
  overflow: hidden;
  color: ${props => props.theme.foregroundStronger};
}

footer small {
  display: block;
  overflow: hidden;
  font-size: 14px;
  line-height: 14px;
  max-height: 28px;
  overflow: hidden;
  color: ${props => props.theme.foregroundStrong};
}

&.placeholder .thumb {
  background: #ccc;
  width: 100%;
  height: 174px;
}

&.placeholder .avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 0.5rem;

  background: #ccc;
}

&.placeholder .bio {
  display: flex;
  flex: 1;
  flex-direction: column;
}

&.placeholder footer p {
  height: 16px;
  margin-bottom: 3px;
  border-radius: 6px;

  background: #ccc;
}`;
