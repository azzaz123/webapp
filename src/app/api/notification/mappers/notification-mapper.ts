import { NotificationConsent, NotificationSettings } from '@api/core/model/notifications';
import { I18nService } from '@core/i18n/i18n.service';
import { NotificationsSettingsDto } from '@api/notifications/dtos/response/notifcations-settings-dto';
import { NotificationsDto } from '@api/notifications/dtos/response/notifcations-dto';
import { NotificationDto } from '../dtos/response/notifcation-dto';
import { Notification } from '@api/core/model/notification/notification.interface';
import { NOTIFICATION_PRODUCT_STATUS } from '@private/features/inbox/core/enums/notification-product-status.enum';
import { NOTIFICATION_VARIANT } from '@private/features/inbox/core/enums/notification-variant.enum';

export function mapNotificationsFromBraze(notifications: NotificationDto[]): Notification[] {
  return notifications.map((notification: NotificationDto) => {
    return {
      variant: _mapToNotificationVariantFromDto(notification.extras.notification_layout),
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

function _mapToNotificationVariantFromDto(notification_layout): NOTIFICATION_VARIANT {
  if (notification_layout === 'round') return NOTIFICATION_VARIANT.PRODUCT;
  else if (notification_layout === 'square') return NOTIFICATION_VARIANT.GENERAL;
  return notification_layout;
}
