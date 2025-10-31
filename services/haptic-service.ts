import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import type { HapticService } from '../types/haptics';

/**
 * Haptic feedback service wrapper for expo-haptics
 * Provides platform-appropriate haptic patterns for iOS and Android
 */
class HapticServiceImpl implements HapticService {
  /**
   * Trigger success haptic feedback
   * Used when an action completes successfully
   */
  success(): void {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      // Silently fail if haptics not available
      console.warn('Haptic feedback not available:', error);
    }
  }

  /**
   * Trigger warning haptic feedback
   * Used for cautionary actions or warnings
   */
  warning(): void {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  }

  /**
   * Trigger error haptic feedback
   * Used when an action fails
   */
  error(): void {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  }

  /**
   * Trigger selection haptic feedback
   * Used for UI interactions like button taps
   */
  selection(): void {
    try {
      // Use impact feedback for better tactile response on button taps
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        // Android uses selection feedback
        Haptics.selectionAsync();
      }
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  }
}

// Export singleton instance
export const hapticService = new HapticServiceImpl();
