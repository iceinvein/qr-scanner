import type { DetectedIntent, IntentDetector, ScanResult } from '../types';
import { IntentType } from '../types';

/**
 * App Link Detector
 * Detects custom URL schemes, universal links, and deep link patterns
 */
export class AppLinkDetector implements IntentDetector {
  // Common custom URL schemes (excluding http/https/ftp which are handled by URL detector)
  private readonly customSchemePattern = /^([a-z][a-z0-9+.-]*):\/\//i;
  
  // Universal link patterns (https with app-specific domains)
  private readonly universalLinkPattern = /^https:\/\/[^/]+\/(app|open|link|deep)/i;
  
  // Common standard schemes to exclude
  private readonly standardSchemes = ['http', 'https', 'ftp', 'mailto', 'tel', 'sms'];

  detect(scanResult: ScanResult): DetectedIntent {
    const { data } = scanResult;
    const trimmedData = data.trim();


    // Check for custom URL schemes
    const schemeMatch = trimmedData.match(this.customSchemePattern);
    if (schemeMatch) {
      const scheme = schemeMatch[1].toLowerCase();
      
      // Exclude standard schemes (they're handled by other detectors)
      if (!this.standardSchemes.includes(scheme)) {
        return {
          type: IntentType.APP_LINK,
          confidence: 0.9,
          rawData: data
        };
      }
    }

    // Check for universal link patterns
    if (this.universalLinkPattern.test(trimmedData)) {
      return {
        type: IntentType.APP_LINK,
        confidence: 0.85,
        rawData: data
      };
    }

    return {
      type: IntentType.UNKNOWN,
      confidence: 0,
      rawData: data
    };
  }
}
