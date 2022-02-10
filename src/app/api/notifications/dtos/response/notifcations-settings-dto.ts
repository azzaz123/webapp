import { BackendNotificationKeys } from '@api/notifications/mappers/notifications-copies-mapper';
import { NotificationsDto } from './notifcations-dto';

export interface NotificationsSettingsDto {
  title: BackendNotificationKeys;
  subtitle: BackendNotificationKeys;
  notifications: NotificationsDto[];
}
