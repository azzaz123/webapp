import { BackendNotificationKeys } from '@api/notifications/mappers/notifications-copies-mapper';

export interface NotificationsDto {
  id: string;
  title: BackendNotificationKeys;
  enabled: boolean;
}
