/**
 * Error Handler Service
 * Provides centralized error handling with categorization and user-friendly messages
 */

import { ErrorHandler, ErrorResponse } from "../types";

export enum ErrorCategory {
  DETECTION = "detection",
  PARSING = "parsing",
  PERMISSION = "permission",
  EXECUTION = "execution",
  NETWORK = "network",
  UNKNOWN = "unknown",
}

export interface CategorizedError extends Error {
  category: ErrorCategory;
  originalError?: Error;
  context?: string;
}

export class ErrorHandlerService implements ErrorHandler {
  /**
   * Categorize an error based on its message and context
   */
  private categorizeError(error: Error, context: string): ErrorCategory {
    const errorMessage = error.message.toLowerCase();

    // Permission errors
    if (
      errorMessage.includes("permission") ||
      errorMessage.includes("denied") ||
      errorMessage.includes("not authorized") ||
      errorMessage.includes("access denied")
    ) {
      return ErrorCategory.PERMISSION;
    }

    // Network errors
    if (
      errorMessage.includes("network") ||
      errorMessage.includes("timeout") ||
      errorMessage.includes("connection") ||
      errorMessage.includes("fetch failed")
    ) {
      return ErrorCategory.NETWORK;
    }

    // Detection errors
    if (
      context.includes("detect") ||
      errorMessage.includes("unknown intent") ||
      errorMessage.includes("unrecognized")
    ) {
      return ErrorCategory.DETECTION;
    }

    // Parsing errors
    if (
      context.includes("parse") ||
      errorMessage.includes("invalid format") ||
      errorMessage.includes("malformed")
    ) {
      return ErrorCategory.PARSING;
    }

    // Execution errors
    if (
      context.includes("execute") ||
      context.includes("action") ||
      errorMessage.includes("failed to open") ||
      errorMessage.includes("app not installed")
    ) {
      return ErrorCategory.EXECUTION;
    }

    return ErrorCategory.UNKNOWN;
  }

  /**
   * Generate user-friendly error message based on category
   */
  private getUserMessage(category: ErrorCategory, error: Error): string {
    switch (category) {
      case ErrorCategory.DETECTION:
        return "Couldn't recognize this QR code format. You can copy the content instead.";

      case ErrorCategory.PARSING:
        return "Unable to read the QR code data. The format may be invalid or corrupted.";

      case ErrorCategory.PERMISSION:
        if (error.message.includes("camera")) {
          return "Camera access is required to scan QR codes. Grant permission in Settings.";
        }
        if (error.message.includes("calendar")) {
          return "Calendar access is required to add events. Grant permission in Settings.";
        }
        if (error.message.includes("contacts")) {
          return "Contacts access is required to save contacts. Grant permission in Settings.";
        }
        return "Permission is required to complete this action. Grant access in Settings.";

      case ErrorCategory.EXECUTION:
        if (error.message.includes("app not installed")) {
          return "This app isn't installed. Opening in browser instead.";
        }
        if (error.message.includes("wifi")) {
          return "Unable to connect to Wi-Fi. You can copy the password to connect manually.";
        }
        if (error.message.includes("wallet")) {
          return "No compatible wallet app found. You can copy the payment details instead.";
        }
        return "Unable to complete this action. Try an alternative option.";

      case ErrorCategory.NETWORK:
        return "Network connection failed. Check your internet and try again.";

      case ErrorCategory.UNKNOWN:
      default:
        return "Something went wrong. You can copy the content to use it manually.";
    }
  }

  /**
   * Determine if an error is retryable
   */
  private isRetryable(category: ErrorCategory): boolean {
    return category === ErrorCategory.NETWORK || category === ErrorCategory.EXECUTION;
  }

  /**
   * Handle an error and return a user-friendly response
   */
  handle(error: Error, context: string): ErrorResponse {
    const category = this.categorizeError(error, context);
    const userMessage = this.getUserMessage(category, error);
    const retryable = this.isRetryable(category);

    // Log error for debugging (in development)
    if (__DEV__) {
      console.error(`[${category}] ${context}:`, error);
    }

    return {
      userMessage,
      retryable,
    };
  }

  /**
   * Create a categorized error
   */
  static createError(
    message: string,
    category: ErrorCategory,
    originalError?: Error
  ): CategorizedError {
    const error = new Error(message) as CategorizedError;
    error.category = category;
    error.originalError = originalError;
    return error;
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandlerService();
