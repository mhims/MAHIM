export interface ClassroomRegistration {
  id: string;
  name: string;
  phone: string;
  course: string;
  message?: string;
  timestamp: string;
  status?: 'new' | 'contacted' | 'enrolled' | 'cancelled';
  notes?: string;
}

export interface ClassroomSettings {
  googleSheetWebhookUrl?: string;
  updatedAt?: string;
}
