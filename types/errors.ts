/**
 * Types for error handling
 */

export interface ErrorResponse {
  userMessage: string;
  fallbackAction?: () => void;
  retryable: boolean;
}

export interface ErrorHandler {
  handle(error: Error, context: string): ErrorResponse;
}
