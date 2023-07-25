import { createTheme } from '@mui/material';
import { Breakpoints } from './breakpoints';

export enum ColorTheme {
  midnights = 'midnights',
  lover = 'lover',
}

export const MidnightsTheme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
  breakpoints: {
    values: Breakpoints,
  },
});

export const LoverColors = {
  background: 'pink',
  primaryText: 'black',
  secondaryText: 'grey',
  primaryButton: 'blue',
  secondaryButton: 'purple',
};
