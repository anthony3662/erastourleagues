import { useState } from 'react';
import { createContext } from '../utils/createContext';
import { ColorTheme, MidnightsTheme } from './colors';
import type { Theme } from '@mui/material';

type ThemeManagerContext = {
  setCurrentTheme: (colors: ColorTheme) => void;
  selectedTheme: Theme;
};

const [useThemeManager, ThemeManagerProvider, themeManagerContext] = createContext<ThemeManagerContext>(() => {
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(ColorTheme.midnights);

  const getTheme = () => {
    switch (currentTheme) {
      case ColorTheme.lover:
        return MidnightsTheme; // need to make a theme
      case ColorTheme.midnights:
        return MidnightsTheme;
      default:
        return MidnightsTheme;
    }
  };

  return {
    setCurrentTheme,
    selectedTheme: getTheme(),
  };
});

export { useThemeManager, ThemeManagerProvider, themeManagerContext };
export type { ThemeManagerContext };
