/**
 * Types for UI components
 */

import type { ReactElement } from "react";

export interface PreviewProps<T> {
	data: T;
	onPrimaryAction: () => void;
	onSecondaryAction: (action: string) => void;
	onDismiss: () => void;
	isProcessing?: boolean;
	metadata?: {
		detectorName?: string;
		detectionTime?: number;
		format?: string;
		dataLength?: number;
		encoding?: string;
		patterns?: string[];
	};
}

export interface PreviewComponent<T> {
	render(props: PreviewProps<T>): ReactElement;
}
