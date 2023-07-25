import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

// need to figure out mobile
export const ActionPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const DraftPanel = styled.div`
  width: fit-content;
`;

export const DraftGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  @media (min-width: 992px) {
    width: 400px;
  }
  @media (min-width: 1200px) {
    width: 700px;
  }
  @media (min-width: 1536px) {
    width: 900px;
  }
`;

export const DraftColumnHeader = styled.div`
  width: 25%;
  font-weight: bold;
  text-align: center;
  overflow-wrap: anywhere;
  font-size: 8px;
  @media (min-width: 384px) {
    font-size: 10px;
  }
  @media (min-width: 576px) {
    font-size: 12px;
  }
  @media (min-width: 768px) {
    font-size: 14px;
  }
  @media (min-width: 1200px) {
    font-size: 16px;
  }
`;

export const DraftColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
`;
