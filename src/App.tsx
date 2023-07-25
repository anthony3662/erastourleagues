import React from 'react';
import './App.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { History } from 'history';
import { unstable_HistoryRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes';
import { AuthenticationProvider } from './services/useAuthentication';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { SocketProvider } from './services/useSocket';
import { ThemeProvider } from '@mui/material';
import { ThemeManagerProvider, useThemeManager } from './theme/useThemeManager';
import { PublicDataProvider } from './services/usePublicData';

function App({ history }: { history: History }) {
  const { selectedTheme } = useThemeManager();
  return (
    <ThemeProvider theme={selectedTheme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <AuthenticationProvider>
          <PublicDataProvider>
            <SocketProvider>
              {/*
// @ts-ignore */}
              <Router history={history}>
                <AppRoutes />
              </Router>
            </SocketProvider>
          </PublicDataProvider>
        </AuthenticationProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

function ThemedApp(props: { history: History }) {
  return (
    <ThemeManagerProvider>
      <App {...props} />
    </ThemeManagerProvider>
  );
}

export default ThemedApp;
