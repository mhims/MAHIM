export interface ClassroomRegistration {
  id: string;
  name: string;
  phone: string;
  whatsapp?: string;
  course: string;
  message?: string;
  paymentMethod?: string;
  trxId?: string;
  fee?: string;
  timestamp: string;
  status?: 'new' | 'contacted' | 'enrolled' | 'cancelled';
  notes?: string;
}

export interface ClassroomSettings {
  googleSheetWebhookUrl?: string;
  updatedAt?: string;
}
