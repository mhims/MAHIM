// Security utilities for Admin & Authentication
const PASSWORD_SALT = '_SALT_MAHIMS_2026';

export async function hashPassword(plainText: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText + PASSWORD_SALT);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyAdminPassword(input: string, storedHash: string): Promise<boolean> {
  if (!input) return false;
  const computedHash = await hashPassword(input);
  return computedHash.toLowerCase() === storedHash.toLowerCase();
}
