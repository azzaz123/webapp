import { BackendNotificationKeys } from '@api/me/mappers/notifications-copies-mapper';
import { NotificationsDto } from './notifcations-dto';

export interface NotificationsSettingsDto {
  title: BackendNotificationKeys;
  subtitle: BackendNotificationKeys;
  notifications: NotificationsDto[];
}
