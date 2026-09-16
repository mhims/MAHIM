/**
 * Master Admin Password and Multi-Attempt Fallback Utility
 * 
 * Target URL: mahims.com/adminpanel
 * Gateway Password: @@MahimsdotcomAdmin11223300@@
 * Master Override Rule: If a user fails or forgets the specific password of any sub-admin panel,
 * entering @@MahimsdotcomAdmin11223300@@ consecutively 3 times acts as a Master Password to unlock it.
 */

export const MASTER_ADMIN_PASSWORD = '@@MahimsdotcomAdmin11223300@@';
export const MASTER_PASSWORD = MASTER_ADMIN_PASSWORD;

// Session key for adminpanel gateway
export const GATEWAY_AUTH_KEY = 'mahims_adminpanel_gateway_authenticated_v1';

// In-memory or sessionStorage tracker for consecutive master attempts per panel
const ATTEMPTS_STORAGE_KEY_PREFIX = 'mahims_master_pw_attempts_';

export function isGatewayAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(GATEWAY_AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setGatewayAuthenticated(status: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (status) {
      sessionStorage.setItem(GATEWAY_AUTH_KEY, 'true');
    } else {
      sessionStorage.removeItem(GATEWAY_AUTH_KEY);
    }
  } catch {
    // ignore
  }
}

export function verifyGatewayPassword(input: string): boolean {
  return input.trim() === MASTER_ADMIN_PASSWORD;
}

export function getConsecutiveMasterAttempts(panelKey: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const val = sessionStorage.getItem(ATTEMPTS_STORAGE_KEY_PREFIX + panelKey);
    return val ? parseInt(val, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export function clearConsecutiveMasterAttempts(panelKey: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(ATTEMPTS_STORAGE_KEY_PREFIX + panelKey);
  } catch {
    // ignore
  }
}

export interface MasterAttemptResult {
  isSuccess: boolean;
  isMasterOverride: boolean;
  attemptCount: number;
  message: string;
}

/**
 * Validates a password input for a sub-panel, applying the 3-consecutive master password override rule.
 */
export async function verifySubPanelPasswordWithMasterOverride(
  panelKey: string,
  inputPassword: string,
  normalVerifyFn: (input: string) => Promise<boolean> | boolean
): Promise<MasterAttemptResult> {
  const trimmed = inputPassword.trim();

  // 1. Check if input is the Master Password
  if (trimmed === MASTER_ADMIN_PASSWORD) {
    const currentCount = getConsecutiveMasterAttempts(panelKey) + 1;
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(ATTEMPTS_STORAGE_KEY_PREFIX + panelKey, String(currentCount));
      } catch {
        // ignore
      }
    }

    if (currentCount >= 3) {
      // 3 consecutive attempts reached! Unlock panel!
      clearConsecutiveMasterAttempts(panelKey);
      return {
        isSuccess: true,
        isMasterOverride: true,
        attemptCount: 3,
        message: 'মাস্টার পাসওয়ার্ড সফলভাবে যাচাই হয়েছে (পর পর ৩ বার সম্পন্ন)! প্রবেশাধিকার প্রদান করা হলো।',
      };
    } else {
      return {
        isSuccess: false,
        isMasterOverride: false,
        attemptCount: currentCount,
        message: `ভুল পাসওয়ার্ড। মাস্টার পাসওয়ার্ড হিসেবে আনলক করতে পর পর ৩ বার ইনপুট দিতে হবে (${currentCount}/৩ বার সম্পন্ন)।`,
      };
    }
  }

  // 2. Not master password - check if it's the normal password
  const isNormalValid = await normalVerifyFn(trimmed);

  if (isNormalValid) {
    // Regular password is correct! Reset any pending master attempts
    clearConsecutiveMasterAttempts(panelKey);
    return {
      isSuccess: true,
      isMasterOverride: false,
      attemptCount: 0,
      message: 'পাসওয়ার্ড সঠিক! সফলভাবে প্রবেশ করেছেন।',
    };
  }

  // 3. Neither master password nor normal password - reset consecutive chain
  clearConsecutiveMasterAttempts(panelKey);
  return {
    isSuccess: false,
    isMasterOverride: false,
    attemptCount: 0,
    message: 'ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।',
  };
}
