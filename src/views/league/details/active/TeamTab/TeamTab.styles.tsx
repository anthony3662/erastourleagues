import { styled as mStyled } from '@mui/material/styles';
import styled from 'styled-components';
import { Box } from '@mui/material';
import { unset } from 'lodash';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Panel = mStyled(Box)(({ theme }) => ({
  padding: 16,
  borderRadius: 8,
  borderColor: theme.palette.primary.main,
  borderWidth: '2px',
  borderStyle: 'solid',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  '.winner': {
    div: {
      color: 'limegreen',
      '-webkit-text-fill-color': 'unset',
      input: {
        color: 'limegreen',
        '-webkit-text-fill-color': 'unset',
      },
    },
  },
}));

export const OutfitIcon = styled.img`
  flex-shrink: 0;
  object-fit: cover;
  border-radius: 4px;
  width: 40px;
  height: 40px;
  @media (min-width: 576px) {
    width: 50px;
    height: 50px;
  }
`;

export const OutfitRow = styled.div`
  display: flex;
  flex-display: row;
  justify-content: space-between;
  align-items: center;
`;

export const OutfitTitleBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: center;
  cursor: pointer;
`;

export const SurpriseHeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
