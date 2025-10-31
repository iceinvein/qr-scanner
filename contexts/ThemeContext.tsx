/**
 * Theme Context
 * Provides theme based on system color scheme
 */

import React, { createContext, useContext, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, type Theme } from '../constants/theme';

interface ThemeContextType {
	theme: Theme;
	isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';
	const theme = isDark ? darkTheme : lightTheme;

	return (
		<ThemeContext.Provider value={{ theme, isDark }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within ThemeProvider');
	}
	return context;
};
