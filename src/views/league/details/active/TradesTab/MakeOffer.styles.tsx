import { styled as mStyled } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';
import styled from 'styled-components';

export const NavRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;
export const OfferPanel = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
`;
export const Column = mStyled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  padding: 16,
  borderRadius: 8,
  border: `solid 2px ${theme.palette.primary.dark}`,
  width: '50%',
  gap: 8,
}));

export const Card = mStyled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 8,
}));

export const Thumbnail = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  flex-shrink: 0;
`;
