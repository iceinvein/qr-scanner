/**
 * Theme Constants
 * Defines color schemes for light and dark modes
 */

export const lightTheme = {
	background: '#FFFFFF',
	surface: '#F2F2F7',
	surfaceSecondary: '#E5E5EA',
	text: '#000000',
	textSecondary: '#8E8E93',
	primary: '#007AFF',
	primaryText: '#FFFFFF',
	error: '#FF3B30',
	errorText: '#FFFFFF',
	border: '#E5E5E5',
	overlay: 'rgba(0, 0, 0, 0.7)',
	cameraPermissionBg: '#1C1C1E',
	cameraPermissionText: '#FFFFFF',
};

export const darkTheme = {
	background: '#000000',
	surface: '#1C1C1E',
	surfaceSecondary: '#2C2C2E',
	text: '#FFFFFF',
	textSecondary: '#8E8E93',
	primary: '#0A84FF',
	primaryText: '#FFFFFF',
	error: '#FF453A',
	errorText: '#FFFFFF',
	border: '#38383A',
	overlay: 'rgba(0, 0, 0, 0.7)',
	cameraPermissionBg: '#2C2C2E',
	cameraPermissionText: '#FFFFFF',
};

export type Theme = typeof lightTheme;
