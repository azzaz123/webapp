import { CommunicationsConsentGroup } from '@api/core/model/communications-consent';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

export const mappedCommunicationsConsentGroup: CommunicationsConsentGroup[] = [
  {
    title: TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_CATALOG_SECTION_TITLE as string,
    subtitle: TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_CATALOG_SECTION_DESCRIPTION as string,
    notifications: [
      {
        id: '2n08z8oj3wrq',
        title: TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_CATALOG_SECTION_ITEMS_EXPIRED_LABEL as string,
        enabled: true,
      },
    ],
  },
];
