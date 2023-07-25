import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-display: row;
  gap: 16px;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 50%;
  @media (min-width: 768px) {
    padding: 16px;
  }
`;
