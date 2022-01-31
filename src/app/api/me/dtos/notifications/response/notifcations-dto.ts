import { BackendNotificationKeys } from '@api/me/mappers/notifications-copies-mapper';

export interface NotificationsDto {
  id: string;
  title: BackendNotificationKeys;
  enabled: boolean;
}
