import { createContext, useContext, useState, useEffect } from 'react';
import { getTheme, getThemeForSport } from '../utils/themes.js';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [themeId, setThemeId] = useState(() => {
        return localStorage.getItem('displayTheme') || 'ice';
    });

    const [themeMode, setThemeMode] = useState(() => {
        return localStorage.getItem('themeSelectionMode') || 'manual';
    });

    const [mode, setMode] = useState('dark');

    const [currentSport, setCurrentSport] = useState(() => {
        return localStorage.getItem('currentSport') || '';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add('dark');
        localStorage.setItem('themeMode', 'dark');
    }, [mode]);

    useEffect(() => {
        localStorage.setItem('displayTheme', themeId);
    }, [themeId]);

    useEffect(() => {
        localStorage.setItem('themeSelectionMode', themeMode);
    }, [themeMode]);

    useEffect(() => {
        if (currentSport) {
            localStorage.setItem('currentSport', currentSport);
        }
    }, [currentSport]);

    const toggleMode = () => {
        setMode('dark');
    };

    const resolvedThemeId = themeMode === 'auto' ? getThemeForSport(currentSport) : themeId;
    const theme = getTheme(resolvedThemeId);
    const colors = theme.colors[mode];
    const fonts = theme.fonts;
    const ui = theme.ui;
    const special = theme.special || {};
    const sportBackgrounds = theme.sportBackgrounds || {};

    const value = {
        themeId,
        setThemeId,
        themeMode,
        setThemeMode,
        resolvedThemeId,
        currentSport,
        setCurrentSport,
        mode,
        setMode,
        toggleMode,
        colors,
        fonts,
        ui,
        special,
        sportBackgrounds,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
