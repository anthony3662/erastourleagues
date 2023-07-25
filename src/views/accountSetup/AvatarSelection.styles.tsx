import styled from 'styled-components';

export const SelectionRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

export const AvatarWrapper = styled.div<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-width: ${({ isSelected }) => (isSelected ? '4px' : '2px')};
  border-style: solid;
  overflow: hidden;
  height: fit-content;
  border-color: ${({ isSelected }) => (isSelected ? 'green' : 'indigo')};
  border-radius: 12px;
  cursor: pointer;
  &:hover {
    border-color: ${({ isSelected }) => (isSelected ? 'limegreen' : 'deeppink')};
  }
`;
