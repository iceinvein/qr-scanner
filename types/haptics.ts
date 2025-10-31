/**
 * Types for haptic feedback
 */

export interface HapticService {
  success(): void;
  warning(): void;
  error(): void;
  selection(): void;
}
