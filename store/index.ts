/**
 * Store exports
 */

// React hooks
export {
    useDetectedIntent,
    useIsProcessing,
    useParsedContent,
    useScanError,
    useScanResult,
    useScanStore
} from "./hooks";

// Orchestrated actions
export {
    executePrimaryAction,
    executeSecondaryAction,
    processScan
} from "./scan-actions";
// Store and basic actions
export {
    clearError,
    dismissPreview,
    resetScanStore,
    scanStore,
    setDetectedIntent,
    setError,
    setParsedContent,
    setProcessing,
    setScanResult
} from "./scan-store";

