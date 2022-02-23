import { NOTIFICATION_LAYOUT, NotificationDto } from '../dtos/response/notifcation-dto';
import { Notification } from '@api/core/model/notification/notification.interface';
import { NOTIFICATION_VARIANT } from '@private/features/inbox/core/enums/notification-variant.enum';

const variantMapper: Record<NOTIFICATION_LAYOUT, NOTIFICATION_VARIANT> = {
  [NOTIFICATION_LAYOUT.ROUND]: NOTIFICATION_VARIANT.PRODUCT,
  [NOTIFICATION_LAYOUT.SQUARED]: NOTIFICATION_VARIANT.GENERAL,
  [NOTIFICATION_LAYOUT.PINNED]: NOTIFICATION_VARIANT.PINNED,
  [NOTIFICATION_LAYOUT.HIGHLIGHTED]: NOTIFICATION_VARIANT.HIGHLIGHTED,
};

export function mapNotificationsFromBraze(notifications: NotificationDto[]): Notification[] {
  return notifications.map((notification: NotificationDto) => {
    return {
      variant: variantMapper[notification.extras.notification_layout],
      productStatus: notification.extras.badge_state,
      isRead: notification.viewed,
      date: notification.updated,
      title: notification.title,
      description: notification.description,
      image: notification.imageUrl,
      url: notification.url,
    };
  });
}
