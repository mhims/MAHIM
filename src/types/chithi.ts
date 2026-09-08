export interface ChithiLetter {
  id: string;
  createdAt: string; // ISO date or formatted string
  timestamp: number;
  content: string;
  senderLocation?: string; // User selected or typed location (e.g. "মিরপুর, ঢাকা")
  locationType?: 'auto' | 'custom' | 'hidden';
  detectedLocation?: {
    city?: string;
    country?: string;
    region?: string;
    ip?: string;
  };
  deviceInfo?: string; // e.g. "Android 14 • Chrome"
  inkColor?: 'blue' | 'black' | 'maroon' | 'emerald';
  paperTheme?: 'vintage' | 'parchment' | 'notebook' | 'blush';
  isRead?: boolean;
  isStarred?: boolean;
}

export interface ChithiSettings {
  googleSheetWebhookUrl?: string;
  autoSyncGoogleSheet?: boolean;
  adminPasswordHash?: string;
}
