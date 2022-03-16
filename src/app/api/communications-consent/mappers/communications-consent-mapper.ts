import { CommunicationsConsent, CommunicationsConsentGroup } from '@api/core/model/communications-consent';
import { I18nService } from '@core/i18n/i18n.service';
import { CommunicationsConsentGroupDto } from '@api/communications-consent/dtos/response/communications-consent-group-dto';
import { CommunicationsConsentDto } from '@api/communications-consent/dtos/response/communications-consent-dto';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

export enum BackendCommunicationsConsentKeys {
  NOTIFICATIONS_CATALOG_EXPIRED_TITLE = 'notifications_catalog_expired_title',
  NOTIFICATIONS_CATALOG_SUBTITLE = 'notifications_catalog_subtitle',
  NOTIFICATIONS_GROUP_CATALOG_TITLE = 'notifications_group_catalog_title',
  NOTIFICATIONS_SAVED_SEARCHES_SEARCH_ALERTS_TITLE = 'notifications_savedsearches_searchalerts_title',
  NOTIFICATIONS_SAVED_SEARCHES_SUBTITLE = 'notifications_savedsearches_subtitle',
  NOTIFICATIONS_GROUP_SAVED_SEARCHES_TITLE = 'notifications_group_savedsearches_title',
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

type CommunicationsConsentMapper = Record<BackendCommunicationsConsentKeys, TRANSLATION_KEY>;

const communicationsConsentMapper: CommunicationsConsentMapper = {
  // Items expired section
  [BackendCommunicationsConsentKeys.NOTIFICATIONS_GROUP_CATALOG_TITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_CATALOG_SECTION_ITEMS_EXPIRED_LABEL,
  [BackendCommunicationsConsentKeys.NOTIFICATIONS_CATALOG_EXPIRED_TITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_CATALOG_SECTION_TITLE,
  [BackendCommunicationsConsentKeys.NOTIFICATIONS_CATALOG_SUBTITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_CATALOG_SECTION_DESCRIPTION,
  // My favourites section
  [BackendCommunicationsConsentKeys.NOTIFICATIONS_GROUP_FAVOURITES_TITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_FAVORITES_SECTION_TITLE,
  [BackendCommunicationsConsentKeys.NOTIFICATIONS_FAVOURITES_SUBTITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_FAVORITES_SECTION_DESCRIPTION,
  [BackendCommunicationsConsentKeys.NOTIFICATIONS_FAVOURITES_DROP_PRICE_TITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_FAVORITES_SECTION_PRICE_DROPS_LABEL,
  [BackendCommunicationsConsentKeys.NOTIFICATIONS_FAVOURITES_SOLD_TITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_FAVORITES_SECTION_FAVORITES_SOLD_LABEL,
  [BackendCommunicationsConsentKeys.NOTIFICATIONS_FAVOURITES_RESERVED_TITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_FAVORITES_SECTION_FAVORITES_RESERVED_LABEL,
  [BackendCommunicationsConsentKeys.NOTIFICATIONS_FAVOURITES_PRODUCT_UPLOADED_TITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_FAVORITES_SECTION_NEW_ITEMS_LABEL,
  // Saved searches
  [BackendCommunicationsConsentKeys.NOTIFICATIONS_SAVED_SEARCHES_SEARCH_ALERTS_TITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_SAVED_SEARCHES_SECTION_TITLE,
  [BackendCommunicationsConsentKeys.NOTIFICATIONS_SAVED_SEARCHES_SUBTITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_SAVED_SEARCHES_SECTION_DESCRIPTION,
  [BackendCommunicationsConsentKeys.NOTIFICATIONS_GROUP_SAVED_SEARCHES_TITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_SAVED_SEARCHES_SECTION_ALERTS_LABEL,
  // Extra options
  [BackendCommunicationsConsentKeys.NOTIFICATIONS_GROUP_EXTRA_TITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_ADDITIONAL_OPTIONS_SECTION_TITLE,
  [BackendCommunicationsConsentKeys.NOTIFICATIONS_EXTRA_SUBTITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_ADDITIONAL_OPTIONS_SECTION_DESCRIPTION,
  [BackendCommunicationsConsentKeys.NOTIFICATIONS_EXTRA_TIPS_TITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_ADDITIONAL_OPTIONS_SECTION_TIPS_SUGGESTIONS_LABEL,
  [BackendCommunicationsConsentKeys.NOTIFICATIONS_EXTRA_PROMO_TITLE]:
    TRANSLATION_KEY.NOTIFICATIONS_VIEW_ALL_USERS_ADDITIONAL_OPTIONS_SECTION_PROMOS_NEWS_LABEL,
};

export function mapCommunicationsConsentGroup(
  communicationsConsentGroupDtos: CommunicationsConsentGroupDto[],
  i18nService: I18nService
): CommunicationsConsentGroup[] {
  return communicationsConsentGroupDtos.map(({ subtitle, title, notifications }: CommunicationsConsentGroupDto) => {
    return {
      title: i18nService.translate(communicationsConsentMapper[title]),
      subtitle: i18nService.translate(communicationsConsentMapper[subtitle]),
      notifications: mapCommunicationsConsents(notifications, i18nService),
    };
  });
}
function mapCommunicationsConsents(communicationsConsents: CommunicationsConsentDto[], i18nService: I18nService): CommunicationsConsent[] {
  return communicationsConsents.map(({ id, title, enabled }: CommunicationsConsentDto) => {
    return {
      id,
      title: i18nService.translate(communicationsConsentMapper[title]),
      enabled,
    };
  });
}
