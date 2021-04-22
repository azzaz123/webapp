import { TRANSLATION_KEY } from '../enum/translation-keys.enum';
import { Translations } from '../interfaces/translations.interface';

export const translations: Translations = {
  [TRANSLATION_KEY.YES]: $localize`:@@web_yes:Yes`,
  [TRANSLATION_KEY.NO]: $localize`:@@web_no:No`,
  [TRANSLATION_KEY.CONSUMER_GOODS_GENERAL_CATEGORY_TITLE]: $localize`:@@web_consumer_goods_category_name:Everything else`,
  [TRANSLATION_KEY.CHAT_DESKTOP_NOTIFICATION_TITLE]: $localize`:@@web_chat_desktop_notification:New message from`,
  [TRANSLATION_KEY.CHAT_MY_PHONE_NUMBER]: $localize`:@@web_chat_my_phone_number:My phone number is`,
  [TRANSLATION_KEY.CHAT_ARCHIVE_CONVERSATION_SUCCESS]: $localize`:@@web_chat_archive_conversation_success:The conversation has been archived correctly`,
  [TRANSLATION_KEY.CHAT_UNARCHIVE_CONVERSATION_SUCCESS]: $localize`:@@web_chat_unarchive_conversation_success:The conversation has been unarchived correctly`,
  [TRANSLATION_KEY.CHAT_REPORT_USER_SUCCESS]: $localize`:@@web_chat_report_user_success:The user has been reported correctly`,
  [TRANSLATION_KEY.CHAT_REPORT_LISTING_SUCCESS]: $localize`:@@web_chat_report_listing_success:The listing has been reported correctly`,
  [TRANSLATION_KEY.CHAT_BLOCK_USER_SUCCESS]: $localize`:@@web_chat_block_user_success:The user has been blocked`,
  [TRANSLATION_KEY.CHAT_UNBLOCK_USER_SUCCESS]: $localize`:@@web_chat_unblock_user_success:The user has been unblocked`,
  [TRANSLATION_KEY.CHAT_INPUT_ENABLED_PLACEHOLDER]: $localize`:@@web_chat_input_enabled_placeholder:Write a message...`,
  [TRANSLATION_KEY.CHAT_INPUT_DISABLED_PLACEHOLDER]: $localize`:@@web_chat_input_disabled_placeholder:Conversation disabled`,
  [TRANSLATION_KEY.CHAT_TOO_MANY_CONVERSATIONS]: $localize`:@@web_chat_too_many_conversations:We can't keep up with you. Wait a moment so you can open up new conversations.`,
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
  [TRANSLATION_KEY.STATS_GRAPH_NO_DATA]: $localize`:@@web_stats_graph_no_data:No data available`,
  [TRANSLATION_KEY.STATS_GRAPH_PHONES_SHARED]: $localize`:@@web_stats_graph_phones_shared:Shared phones`,
  [TRANSLATION_KEY.STATS_GRAPH_CITY_BUMP]: $localize`:@@web_stats_graph_city_bump:City Bump`,
  [TRANSLATION_KEY.STATS_GRAPH_COUNTRY_BUMP]: $localize`:@@web_stats_graph_:Country Bump`,
  [TRANSLATION_KEY.STATS_GRAPH_VIEWS]: $localize`:@@web_stats_graph_views:Views`,
  [TRANSLATION_KEY.STATS_GRAPH_CHATS]: $localize`:@@web_stats_graph_chats:Chats`,
  [TRANSLATION_KEY.STATS_GRAPH_LAST_THIRTY_DAYS]: $localize`:@@web_stats_graph_last_thirty_days:Last 30 days`,
  [TRANSLATION_KEY.STATS_GRAPH_LAST_FIFTEEN_DAYS]: $localize`:@@web_stats_graph_last_fifteen_days:Last 15 days`,
  [TRANSLATION_KEY.STATS_GRAPH_LAST_SEVEN_DAYS]: $localize`:@@web_stats_graph_last_seven_days:Last 7 days`,
  [TRANSLATION_KEY.TOAST_ERROR_TITLE]: $localize`:@@web_toast_error_title:Oops!`,
  [TRANSLATION_KEY.PRO_SUBSCRIPTION_CANCEL_SUBSCRIPTION_SUCCESS_TITLE]: $localize`:@@web_pro_subscription_cancel_success_title:Subscription cancelled.`,
  [TRANSLATION_KEY.PRO_SUBSCRIPTION_CANCEL_SUBSCRIPTION_SUCCESS_BODY]: $localize`:@@web_pro_subscription_cancel_success_body:We are sad to see you go.`,
  [TRANSLATION_KEY.PRO_SUBSCRIPTION_CANCEL_SUBSCRIPTION_ERROR_TITLE]: $localize`:@@web_pro_subscription_cancel_error_title:There was an error`,
  [TRANSLATION_KEY.PRO_SUBSCRIPTION_CANCEL_SUBSCRIPTION_ERROR_BODY]: $localize`:@@web_pro_subscription_cancel_error_body:Your subscription could not be cancelled.`,
};
