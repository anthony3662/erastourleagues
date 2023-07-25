import styled from 'styled-components';
import { styled as mStyled } from '@mui/material/styles';
import { Box } from '@mui/material';
export const Panel = mStyled(Box)(({ theme }) => ({
  padding: 16,
  borderRadius: 8,
  border: `solid 2px ${theme.palette.primary.dark}`,
}));

export const AvatarsRow = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;
