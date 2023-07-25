import { styled as mStyled } from '@mui/material/styles';
import styled from 'styled-components';
import { Box } from '@mui/material';

export const Wrapper = mStyled(Box)(({ theme }) => ({
  padding: 16,
  borderRadius: 8,
  border: `solid 2px ${theme.palette.primary.dark}`,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
}));

export const ThumbnailRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

export const Thumbnail = styled.img`
  cursor: pointer;
  object-fit: cover;
  border-radius: 4px;
  width: 40px;
  height: 40px;
  @media (min-width: 576px) {
    width: 50px;
    height: 50px;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
`;
