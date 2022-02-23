import { NotificationConsent, NotificationSettings } from '@api/core/model/notifications';
import { I18nService } from '@core/i18n/i18n.service';
import { NotificationsSettingsDto } from '@api/notifications/dtos/response/notifcations-settings-dto';
import { NotificationsDto } from '@api/notifications/dtos/response/notifcations-dto';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

export enum BackendNotificationKeys {
  NOTIFICATIONS_CATALOG_EXPIRED_TITLE = 'notifications_catalog_expired_title',
  NOTIFICATIONS_CATALOG_SUBTITLE = 'notifications_catalog_subtitle',
  NOTIFICATIONS_GROUP_CATALOG_TITLE = 'notifications_group_catalog_title',
  NOTIFICATIONS_SAVEDSEARCHES_SEARCHALERTS_TITLE = 'notifications_savedsearches_searchalerts_title',
  NOTIFICATIONS_SAVEDSEARCHES_SUBTITLE = 'notifications_savedsearches_subtitle',
  NOTIFICATIONS_GROUP_SAVEDSEARCHES_TITLE = 'notifications_group_savedsearches_title',
  NOTIFICATIONS_FAVOURITES_DROP_PRICE_TITLE = 'notifications_favourites_drop_price_title',
  NOTIFICATIONS_FAVOURITES_SOLD_TITLE = 'notifications_favourites_sold_title',
  NOTIFICATIONS_FAVOURITES_RESERVED_TITLE = 'notifications_favourites_reserved_title',
  NOTIFICATIONS_FAVOURITES_PRODUCT_UPLOADED_TITLE = 'notifications_favourites_product_uploaded_title',
  NOTIFICATIONS_FAVOURITES_SUBTITLE = 'notifications_favourites_subtitle',
  NOTIFICATIONS_GROUP_FAVOURITES_TITLE = 'notifications_group_favourites_title',
  NOTIFICATIONS_EXTRA_TIPS_TITLE = 'notifications_extra_tips_title',
  NOTIFICATIONS_EXTRA_PROMO_TITLE = 'notifications_extra_promo_title',
  NOTIFICATIONS_EXTRA_SUBTITLE = 'notifications_extra_subtitle',
  NOTIFICATIONS_GROUP_EXTRA_TITLE = 'notifications_group_extra_title',
}

type NotificationMapper = Record<BackendNotificationKeys, TRANSLATION_KEY>;

const notifications: NotificationMapper = {
  [BackendNotificationKeys.NOTIFICATIONS_CATALOG_EXPIRED_TITLE]: TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_CATALOG_SECTION_TITLE,
  [BackendNotificationKeys.NOTIFICATIONS_CATALOG_SUBTITLE]: TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_CATALOG_SECTION_DESCRIPTION,
  [BackendNotificationKeys.NOTIFICATIONS_GROUP_CATALOG_TITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_CATALOG_SECTION_ITEMS_EXPIRED_LABEL,
  [BackendNotificationKeys.NOTIFICATIONS_SAVEDSEARCHES_SEARCHALERTS_TITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_SAVED_SEARCHES_SECTION_TITLE,
  [BackendNotificationKeys.NOTIFICATIONS_SAVEDSEARCHES_SUBTITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_SAVED_SEARCHES_SECTION_DESCRIPTION,
  [BackendNotificationKeys.NOTIFICATIONS_GROUP_SAVEDSEARCHES_TITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_SAVED_SEARCHES_SECTION_ALERTS_LABEL,
  [BackendNotificationKeys.NOTIFICATIONS_FAVOURITES_DROP_PRICE_TITLE]: TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_FAVORITES_SECTION_TITLE,
  [BackendNotificationKeys.NOTIFICATIONS_FAVOURITES_SOLD_TITLE]: TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_FAVORITES_SECTION_DESCRIPTION,
  [BackendNotificationKeys.NOTIFICATIONS_FAVOURITES_RESERVED_TITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_FAVORITES_SECTION_PRICE_DROPS_LABEL,
  [BackendNotificationKeys.NOTIFICATIONS_FAVOURITES_PRODUCT_UPLOADED_TITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_FAVORITES_SECTION_FAVORITES_SOLD_LABEL,
  [BackendNotificationKeys.NOTIFICATIONS_FAVOURITES_SUBTITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_FAVORITES_SECTION_FAVORITES_RESERVED_LABEL,
  [BackendNotificationKeys.NOTIFICATIONS_GROUP_FAVOURITES_TITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_FAVORITES_SECTION_NEW_ITEMS_LABEL,
  [BackendNotificationKeys.NOTIFICATIONS_EXTRA_TIPS_TITLE]: TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_ADDITIONAL_OPTIONS_SECTION_TITLE,
  [BackendNotificationKeys.NOTIFICATIONS_EXTRA_PROMO_TITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_ADDITIONAL_OPTIONS_SECTION_DESCRIPTION,
  [BackendNotificationKeys.NOTIFICATIONS_EXTRA_SUBTITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_ADDITIONAL_OPTIONS_SECTION_TIPS_SUGGESTIONS_LABEL,
  [BackendNotificationKeys.NOTIFICATIONS_GROUP_EXTRA_TITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_ADDITIONAL_OPTIONS_SECTION_PROMOS_NEWS_LABEL,
};

function mapBackendNotificationCopyToFrontend(key: BackendNotificationKeys): TRANSLATION_KEY {
  return notifications[key];
}

export function mapNotificationsSettings(
  notificationSettings: NotificationsSettingsDto[],
  i18nService: I18nService
): NotificationSettings[] {
  return notificationSettings.map(({ subtitle, title, notifications }: NotificationsSettingsDto) => {
    return {
      title: i18nService.translate(mapBackendNotificationCopyToFrontend(title)),
      subtitle: i18nService.translate(mapBackendNotificationCopyToFrontend(subtitle)),
      notifications: mapNotifications(notifications, i18nService),
    };
  });
}
export function mapNotifications(notifications: NotificationsDto[], i18nService: I18nService): NotificationConsent[] {
  return notifications.map(({ id, title, enabled }: NotificationsDto) => {
    return {
      id,
      title: i18nService.translate(mapBackendNotificationCopyToFrontend(title)),
      enabled,
    };
  });
}
