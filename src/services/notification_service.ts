import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from '../lib/firebase';

class NotificationService {
  private messaging;
  private vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

  constructor() {
    if (typeof window !== 'undefined') {
      this.messaging = getMessaging(app);
    }
  }

  async requestPermission(): Promise<string | null> {
    try {
      if (!this.messaging) return null;

      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(this.messaging, {
          vapidKey: this.vapidKey,
        });
        return token;
      }
      return null;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return null;
    }
  }

  onMessageReceived(callback: (payload: any) => void) {
    if (!this.messaging) return;

    onMessage(this.messaging, (payload) => {
      // Create a notification if the app is in the foreground
      if (Notification.permission === 'granted') {
        const { title, body } = payload.notification || {};
        new Notification(title || 'New SOS Alert', {
          body: body || 'A new SOS alert has been received',
          icon: '/notification-icon.png', // Add your notification icon
        });
      }
      callback(payload);
    });
  }

  async sendTestNotification() {
    if (!this.messaging) return;

    try {
      const token = await this.requestPermission();
      if (!token) {
        console.error('No notification permission granted');
        return;
      }

      // This would typically be handled by your backend
      console.log('Would send notification to token:', token);
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  }
}

export const notificationService = new NotificationService(); 