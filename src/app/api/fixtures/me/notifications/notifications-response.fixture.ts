import { NotificationsSettingsDto } from '@api/me/dtos/notifications-settings/response/notifcations-settings-dto';
import { NotificationsSettingsResponseDto } from '@api/me/dtos/notifications-settings/response/notifcations-settings-response-dto';
import { BackendNotificationKeys } from '@api/me/mappers/notifications-copies-mapper';

const notificationGroups: NotificationsSettingsDto[] = [
  {
    title: BackendNotificationKeys.NOTIFICATIONS_CATALOG_EXPIRED_TITLE,
    subtitle: BackendNotificationKeys.NOTIFICATIONS_CATALOG_SUBTITLE,
    notifications: [
      {
        id: '2n08z8oj3wrq',
        title: BackendNotificationKeys.NOTIFICATIONS_GROUP_CATALOG_TITLE,
        enabled: true,
      },
    ],
  },
];

export const notificationIdToModify = '2n08z8oj3wrq';
export const notificationsSettingsResponseFixture: NotificationsSettingsResponseDto = {
  notificationGroups: notificationGroups,
};

// export const notificationsSettingsResponseFixture: NotificationsSettingsDto[] = notificationsSettingsDto;
