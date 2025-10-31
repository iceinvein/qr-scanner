/**
 * Hook for creating themed styles
 * Provides a convenient way to create styles that respond to theme changes
 */

import { useTheme } from '@/contexts/ThemeContext';
import type { Theme } from '@/constants/theme';
import { useMemo } from 'react';
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export function useThemedStyles<T extends NamedStyles<T>>(
	styleFactory: (theme: Theme) => T
): T {
	const { theme } = useTheme();
	return useMemo(() => styleFactory(theme), [theme, styleFactory]);
}
