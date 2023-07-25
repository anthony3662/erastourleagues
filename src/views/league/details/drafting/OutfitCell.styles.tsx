import styled from 'styled-components';

export const ColorTable = {
  Lover: 'rgba(220, 72, 130, 0.2)',
  Midnights: 'rgba(0, 0, 80, 0.4)',
  Evermore: 'rgba(233, 227, 177, 0.7)',
  Folklore: 'rgba(124, 124, 124, 0.25)',
  'Surprise Songs': 'rgba(113, 216, 113, 0.3)',
  'Speak Now': 'rgba(183, 0, 255, 0.30)',
  1989: 'rgba(0, 160, 255, 0.25)',
  Fearless: 'rgba(233, 233, 0, 0.4)',
  Red: 'rgba(217, 0, 0, 0.6)',
};

export const Cell = styled.div`
  padding: 10px;
  border-radius: 8px;
  border: solid 1px black;
  height: 50px;
  @media (min-width: 576px) {
    height: 60px;
  }
  @media (min-width: 768px) {
    height: 70px;
  }
`;

export const TimerCell = styled(Cell)`
  background-color: black;
  color: white;
  cursor: pointer;
`;

export const DraftOutfitCell = styled(Cell)<{ category: string }>`
  cursor: pointer;
  background-color: ${({ category }) =>
    // @ts-ignore
    ColorTable[category]};
`;

export const OutfitHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  @media (min-width: 576px) {
    font-size: 12px;
  }
  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

export const OutfitTitle = styled.p`
  font-size: 10px;
  @media (min-width: 768px) {
    font-size: 12px;
  }
  @media (min-width: 1200px) {
    font-size: 14px;
  }
`;

export const PopoverContainer = styled.div`
  padding: 12px;
`;

export const OutfitImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: contain;
  @media (min-width: 768px) {
    width: 400px;
    height: 400px;
  }
`;
