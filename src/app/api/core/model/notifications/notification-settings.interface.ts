import { NotificationConsent } from './notification-consent.interface';

export interface NotificationSettings {
  title: string;
  subtitle: string;
  notifications: NotificationConsent[];
}
