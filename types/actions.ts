/**
 * Types for action handling
 */

export interface ActionResult {
  success: boolean;
  error?: string;
  fallbackAction?: () => void;
}

export interface ActionHandler<T> {
  executePrimary(data: T): Promise<ActionResult>;
  executeSecondary(action: string, data: T): Promise<ActionResult>;
}
