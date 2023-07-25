import styled from 'styled-components';
import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  @media (min-width: 576px) {
    height: 700px;
  }
  @media (min-width: 768px) {
    height: 800px;
  }
  @media (min-width: 992px) {
    height: 800px;
  }
`;

export const OutfitsPanel = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
`;

export const useStyles = makeStyles((theme: Theme) => ({
  fab: {
    position: 'fixed',
    bottom: '32px',
    right: '32px',
    zIndex: theme.zIndex.tooltip, // Ensures the FAB appears above other elements
  },
  toggleButtonGroup: {
    [theme.breakpoints.down('lg')]: {
      position: 'fixed',
      backgroundColor: 'white',
      bottom: 100,
      right: 0,
    },
  },
}));
