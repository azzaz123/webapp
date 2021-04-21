import { TRANSLATION_KEY } from '../enum/translation-keys.enum';
import { Translations } from '../interfaces/translations.interface';

export const translations: Translations = {
  [TRANSLATION_KEY.CONSUMER_GOODS_GENERAL_CATEGORY_TITLE]: $localize`:@@web_consumer_goods_category_name:Everything else`,
  [TRANSLATION_KEY.CHAT_DESKTOP_NOTIFICATION_TITLE]: $localize`:@@web_chat_desktop_notification:New message from`,
  [TRANSLATION_KEY.CHAT_MY_PHONE_NUMBER]: $localize`:@@web_chat_my_phone_number:My phone number is`,
  [TRANSLATION_KEY.CHAT_ARCHIVE_CONVERSATION_SUCCESS]: $localize`:@@web_chat_archive_conversation_success:The conversation has been archived correctly`,
  [TRANSLATION_KEY.CHAT_UNARCHIVE_CONVERSATION_SUCCESS]: $localize`:@@web_chat_unarchive_conversation_success:The conversation has been unarchived correctly`,
  [TRANSLATION_KEY.CHAT_REPORT_USER_SUCCESS]: $localize`:@@web_chat_report_user_success:The user has been reported correctly`,
  [TRANSLATION_KEY.CHAT_REPORT_LISTING_SUCCESS]: $localize`:@@web_chat_report_listing_success:The listing has been reported correctly`,
  [TRANSLATION_KEY.CHAT_BLOCK_USER_SUCCESS]: $localize`:@@web_chat_block_user_success:The user has been blocked`,
  [TRANSLATION_KEY.CHAT_UNBLOCK_USER_SUCCESS]: $localize`:@@web_chat_unblock_user_success:The user has been unblocked`,
  [TRANSLATION_KEY.ACTIVE]: $localize`:@@web_catalog_active:Active`,
  [TRANSLATION_KEY.INACTIVE]: $localize`:@@web_catalog_inactive:Inactive`,
  [TRANSLATION_KEY.SOLD]: $localize`:@@web_catalog_sold:Sold`,
  [TRANSLATION_KEY.PUBLISHED]: $localize`:@@web_catalog_published:Selling`,
  [TRANSLATION_KEY.REVIEWS]: $localize`:@@web_catalog_reviews:Reviews`,
  [TRANSLATION_KEY.SEARCH_BY_TITLE]: $localize`:@@web_catalog_filter_input:Search by title`,
  [TRANSLATION_KEY.DATE_DESC]: $localize`:@@web_catalog_filter_date_desc:Date: from recent to old`,
  [TRANSLATION_KEY.DATE_ASC]: $localize`:@@web_catalog_filter_date_asc:Date: from old to recent`,
  [TRANSLATION_KEY.PRICE_DESC]: $localize`:@@web_catalog_filter_price_desc:Price: from high to low`,
  [TRANSLATION_KEY.PRICE_ASC]: $localize`:@@web_catalog_filter_price_asc:Price: from low to high`,
};
