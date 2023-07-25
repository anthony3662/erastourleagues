import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
  cursor: pointer;
`;

export const PlayerBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 50%;
  padding: 12px;
  @media (min-width: 576px) {
    padding: 24px;
  }
  border-radius: 12px;
`;

export const PlayerDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  gap: 8px;
`;

export const PlayerAvatar = styled.img<{ isWinning?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border-width: 2px;
  border-style: solid;
  border-color: ${({ isWinning }) => {
    if (isWinning === undefined) {
      return 'black';
    }
    return isWinning ? 'lime' : 'red';
  }};
`;

export const OutfitIcon = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 4px;
  flex-shrink: 0;
  object-fit: cover;
`;
