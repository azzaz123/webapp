import { NotificationsSettingsDto } from '@api/notifications/dtos/response/notifcations-settings-dto';
import { NotificationsSettingsResponseDto } from '@api/notifications/dtos/response/notifcations-settings-response-dto';
import { BackendNotificationKeys } from '@api/me/mappers/notifications-copies-mapper';

export const notificationIdToModify = '2n08z8oj3wrq';

const notificationGroups: NotificationsSettingsDto[] = [
  {
    title: BackendNotificationKeys.NOTIFICATIONS_CATALOG_EXPIRED_TITLE,
    subtitle: BackendNotificationKeys.NOTIFICATIONS_CATALOG_SUBTITLE,
    notifications: [
      {
        id: notificationIdToModify,
        title: BackendNotificationKeys.NOTIFICATIONS_GROUP_CATALOG_TITLE,
        enabled: true,
      },
    ],
  },
];

export const notificationsSettingsResponseFixture: NotificationsSettingsResponseDto = {
  notificationGroups: notificationGroups,
};
