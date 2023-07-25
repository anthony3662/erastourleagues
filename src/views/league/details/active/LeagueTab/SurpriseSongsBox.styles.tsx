import styled from 'styled-components';

export const ContentRow = styled.div`
  display: flex;
  flex-display: row;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  :hover {
    color: blue;
  }
`;

export const PopoverWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
`;
