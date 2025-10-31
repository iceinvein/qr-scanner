/**
 * Scan Result Handler
 * Captures scan results with debouncing to prevent duplicate processing
 * Requirements: 1.1
 */

import { useCallback, useRef } from "react";
import type { ScanResult } from "../types/intents";

export interface UseScanResultHandlerOptions {
	onScan: (result: ScanResult) => void;
	debounceMs?: number;
}

export interface ScanResultHandler {
	handleScan: (data: string) => void;
	isScanning: boolean;
	resetScanning: () => void;
}

/**
 * Hook to handle scan results with debouncing
 * Prevents duplicate processing of rapid scans (Requirement 1.1)
 */
export const useScanResultHandler = ({
	onScan,
	debounceMs = 2000,
}: UseScanResultHandlerOptions): ScanResultHandler => {
	const lastScanRef = useRef<string | null>(null);
	const lastScanTimeRef = useRef<number>(0);
	const isScanningRef = useRef<boolean>(true);

	const handleScan = useCallback(
		(data: string) => {
			const now = Date.now();
			const timeSinceLastScan = now - lastScanTimeRef.current;

			// Debounce: Ignore if same data scanned within debounce window
			if (
				lastScanRef.current === data &&
				timeSinceLastScan < debounceMs
			) {
				return;
			}

			// Update refs
			lastScanRef.current = data;
			lastScanTimeRef.current = now;
			isScanningRef.current = false;

			// Create scan result and trigger processing
			const scanResult: ScanResult = {
				data,
				timestamp: now,
			};

			onScan(scanResult);
		},
		[onScan, debounceMs],
	);

	const resetScanning = useCallback(() => {
		isScanningRef.current = true;
		lastScanRef.current = null;
	}, []);

	return {
		handleScan,
		isScanning: isScanningRef.current,
		resetScanning,
	};
};
