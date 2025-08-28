
export interface Notification {
  id: string;
  userId: string;
  type: 'offer' | 'booking' | 'payment' | 'message' | 'review' | 'system';
  title: string;
  content: string;
  referenceId?: string;
  referenceType?: 'offer' | 'booking' | 'payment' | 'conversation';
  isRead: boolean;
  sentToWhatsApp: boolean;
  whatsAppStatus?: 'sent' | 'delivered' | 'read' | 'failed';
  createdAt: Date;
}

export interface NotificationPreferences {
  inApp: {
    offers: boolean;
    bookings: boolean;
    payments: boolean;
    messages: boolean;
    reviews: boolean;
  };
  whatsapp: {
    offers: boolean;
    bookings: boolean;
    payments: boolean;
    messages: boolean;
    reviews: boolean;
  };
}
