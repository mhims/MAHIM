export type SalamiType = 'নেওয়া' | 'পাঠানো';

export interface SalamiRecord {
  id: string;
  timestamp: string;
  type: SalamiType;
  name: string;
  phone: string;
  age?: string;
  amount: string;
  message: string;
  status: 'pending' | 'paid';
  isStarred?: boolean;
  createdAt: number;
}

export interface SalamiSettings {
  googleSheetWebhookUrl?: string;
  bKashNumber?: string;
  nagadNumber?: string;
  rocketNumber?: string;
}
