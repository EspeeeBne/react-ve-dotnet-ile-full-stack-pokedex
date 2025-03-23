/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useContext, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { enUS, trTR } from '@mui/material/locale';
import { useTranslation } from 'react-i18next';

import darkTheme from './darkTheme';
import lightTheme from './lightTheme';

const ThemeContext = createContext();

const languageMap = {
en: enUS,
tr: trTR,
};

export function CustomThemeProvider({ children }) {
const [darkMode, setDarkMode] = useState(true);
const { i18n } = useTranslation();

const toggleTheme = () => {
    setDarkMode((prev) => !prev);
};

const theme = useMemo(() => {
    const baseTheme = darkMode ? darkTheme : lightTheme;
    const selectedLocale = languageMap[i18n.language] || enUS;

    let createdTheme = createTheme(
    {
        ...baseTheme,
        direction: i18n.dir(i18n.language),
    },
    selectedLocale
    );

    createdTheme = responsiveFontSizes(createdTheme);

    return createdTheme;
}, [darkMode, i18n.language, i18n]);

return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
    <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
    </MuiThemeProvider>
    </ThemeContext.Provider>
);
}

export function useThemePoke() {
return useContext(ThemeContext);
}
