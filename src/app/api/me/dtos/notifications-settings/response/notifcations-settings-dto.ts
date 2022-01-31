import { BackendNotificationKeys } from '@api/me/mappers/notifications-copies-mapper';
import { NotificationsDto } from '../../notifications/response/notifcations-dto';

export interface NotificationsSettingsDto {
  title: BackendNotificationKeys;
  subtitle: BackendNotificationKeys;
  notifications: NotificationsDto[];
}
