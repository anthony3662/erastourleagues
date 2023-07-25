import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 32px;
  margin: 32px;
  border-style: solid;
  border-width: 2px;
  border-radius: 12px;
`;

export const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 225px);
  justify-content: space-between;
  grid-gap: 32px;
  @media (max-width: 575px) {
    justify-content: center;
  }
`;

export const Title = styled.h1`
  @media (max-width: 575px) {
    text-align: center;
  }
`;
