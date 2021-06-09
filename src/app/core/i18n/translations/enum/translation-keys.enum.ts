export enum TRANSLATION_KEY {
  YES,
  NO,
  MALE,
  FEMALE,
  CONSUMER_GOODS_GENERAL_CATEGORY_TITLE,
  CHAT_DESKTOP_NOTIFICATION_TITLE,
  CHAT_MY_PHONE_NUMBER,
  CHAT_ARCHIVE_CONVERSATION_SUCCESS,
  CHAT_UNARCHIVE_CONVERSATION_SUCCESS,
  CHAT_REPORT_USER_SUCCESS,
  CHAT_REPORT_LISTING_SUCCESS,
  CHAT_BLOCK_USER_SUCCESS,
  CHAT_UNBLOCK_USER_SUCCESS,
  CHAT_INPUT_ENABLED_PLACEHOLDER,
  CHAT_INPUT_DISABLED_PLACEHOLDER,
  CHAT_TOO_MANY_CONVERSATIONS,
  ACTIVE,
  INACTIVE,
  SOLD,
  PUBLISHED,
  REVIEWS,
  SEARCH_BY_TITLE,
  DATE_DESC,
  DATE_ASC,
  PRICE_DESC,
  PRICE_ASC,
  STATS_GRAPH_NO_DATA,
  STATS_GRAPH_PHONES_SHARED,
  STATS_GRAPH_CITY_BUMP,
  STATS_GRAPH_COUNTRY_BUMP,
  STATS_GRAPH_VIEWS,
  STATS_GRAPH_CHATS,
  STATS_GRAPH_LAST_THIRTY_DAYS,
  STATS_GRAPH_LAST_FIFTEEN_DAYS,
  STATS_GRAPH_LAST_SEVEN_DAYS,
  STATS_FAVORITES,
  STATS_VIEWS,
  STATS_CHATS,
  TOAST_ERROR_TITLE,
  PRO_SUBSCRIPTION_CANCEL_SUCCESS_TITLE,
  PRO_SUBSCRIPTION_CANCEL_SUCCESS_BODY,
  PRO_SUBSCRIPTION_CANCEL_ERROR_TITLE,
  PRO_SUBSCRIPTION_CANCEL_ERROR_BODY,
  PRO_SUBSCRIPTION_CONTINUE_SUCCESS_TITLE,
  PRO_SUBSCRIPTION_CONTINUE_SUCCESS_BODY,
  PRO_SUBSCRIPTION_CONTINUE_ERROR_TITLE,
  PRO_SUBSCRIPTION_CONTINUE_ERROR_BODY,
  PRO_SUBSCRIPTION_EDIT_SUCCESS_TITLE,
  PRO_SUBSCRIPTION_EDIT_SUCCESS_BODY,
  PRO_SUBSCRIPTION_EDIT_ERROR_TITLE,
  PRO_SUBSCRIPTION_EDIT_ERROR_BODY,
  PRO_SUBSCRIPTION_CARD_SET,
  PRO_SUBSCRIPTION_CARD_DELETED,
  WALLAPOP_PRO,
  BECOME_PRO,
  DAY,
  HOUR,
  MINUTE,
  LEFT,
  CARD_NUMBER_INVALID,
  CARD_DATE_INVALID,
  CARD_CVC_INVALID,
  NO_RESULTS_FOUND,
  SEARCH_INPUT_PLACEHOLDER,
  DEFAULT_ERROR_MESSAGE,
  TOAST_DEFAULT_SUCCESS_TITLE,
  BUMP_ERROR,
  NO_CARD_SELECTED_ERROR,
  PRODUCT_CREATED,
  ALREADY_FEATURED_ERROR,
  FORM_FIELD_ERROR_TITLE,
  FORM_FIELD_ERROR,
  BULK_DELETE_ERROR,
  BULK_RESERVE_ERROR,
  INVOICE_CANNOT_GENERATE_ERROR,
  INVOICE_CANNOT_DOWNLOAD_ERROR,
  PAYMENT_FAILED_ERROR,
  PAYMENT_FAILED_ERROR_TITLE,
  PAYMENT_FAILED_UNKNOWN_ERROR,
  MISSING_IMAGE_ERROR,
  PHONE_NUMBER_ERROR,
  SERVER_ERROR,
  PACK_ERROR,
  LINK_ERROR,
  DELETE_ITEM_ERROR,
  EDIT_ITEM_ERROR,
  INVALID_PASSWORD_ERROR,
  ADD_NEW_CARD_ERROR,
  DELETE_BILLING_INFO_ERROR,
  PASSWORD_MIN_LENGTH_ERROR,
  PASSWORD_DO_NOT_MATCH_ERROR,
  SUBSCRIPTION_CARD_NOT_SET_ERROR,
  STRIPE_CARDS_RETRIEVAL_ERROR,
  UPLOAD_EXTENSION_NOT_ALLOWED_ERROR,
  UPLOAD_MAX_UPLOADS_ERROR,
  UPLOAD_MAX_SIZE_ERROR,
  ITEM_UPDATED,
  INVOICE_GENERATED,
  INVOICE_DOWNLOADED,
  USER_EDITED,
  IMAGE_UPLOADED,
  SUGGESTED_CATEGORY,
  DELETE_BILLING_INFO,
  DELETE_ITEMS_TITLE,
  DELETE_ITEMS_DESCRIPTION,
  DELETE_BUTTON,
  RESERVE_ITEMS_TITLE,
  RESERVE_ITEMS_DESCRIPTION,
  RESERVE_BUTTON,
  REMOVE_FEATURED_PROFILE_FAVORITE_TITLE,
  REMOVE_FEATURED_PROFILE_FAVORITE_DESCRIPTION,
  REMOVE_BUTTON,
  PROFILE_NO_LONGER_FEATURED_TITLE,
  PROFILE_NO_LONGER_FEATURED_DESCRIPTION,
  REMOVE_ITEM_FROM_FAVORITES_TITLE,
  REMOVE_ITEM_FROM_FAVORITES_DESCRIPTION,
  DELETE_CARD_TITLE,
  DELETE_CARD_DESCRIPTION,
  I_AM_SURE_CONFIRMATION,
  DELIVERY_ADDRESS_SAVE_SUCCESS,
  DELIVERY_ADDRESS_DELETE_SUCCESS,
  DELIVERY_ADDRESS_SAVE_ERROR,
  DELIVERY_ADDRESS_POSTAL_CODE_MISSMATCH_LOCATION_ERROR,
  DELIVERY_ADDRESS_POSTAL_CODE_NOT_ALLOWED_ERROR,
  DELIVERY_ADDRESS_POSTAL_CODE_INVALID_ERROR,
  DELIVERY_ADDRESS_DELETE_REQUEST,
  DELIVERY_BANK_ACCOUNT_CREATE_SUCCESS,
  DELIVERY_BANK_ACCOUNT_EDIT_SUCCESS,
  DELIVERY_ADDRESS_CONTINUE_BUTTON,
  DELIVERY_ADDRESS_COUNTRY_CHANGE_CONFIRMATION_MESSAGE,
  // TODO: Remaining keys with no explicit usage. Some of them might come from the backend so we need to keep it's string value
  //       We leave cleaning this keys after Italy release, as some of them come from some legacy parts (chat, calls..)
  //       and it is really difficult to follow the keys as this part needs a refactor

  TO_CLEAN_DEFAULT_ERROR_MESSAGE = 'defaultErrorMessage',
  TO_CLEAN_BULK_SOLD_ERROR = 'bulkSoldError',
  TO_CLEAN_PHONE_CALLS = 'phoneCalls',
  TO_CLEAN_PHONES = 'phones',
  TO_CLEAN_MEETINGS = 'meetings',
  TO_CLEAN_MESSAGES = 'messages',
  TO_CLEAN_SHARED_PHONE = 'shared',
  TO_CLEAN_MISSED_CALL = 'missed',
  TO_CLEAN_ANSWERED_CALL = 'answered',
  TO_CLEAN_FEATURED = 'featured',
  TO_CLEAN_ERROR_PURCHASING_ITEMS = 'errorPurchasingItems',
  TO_CLEAN_SETTINGS_EDITED = 'settingsEdited',
  TO_CLEAN_TWITTER_SHARE = 'twitterShare',
  TO_CLEAN_COUNTRY_BUMP = 'countrybump',
  TO_CLEAN_ZONE_BUMP = 'zonebump',
  TO_CLEAN_CARS_TUTORIAL_LISTING_LIMIT_5 = 'cars_subscription_tutorial_listinglimit5',
  TO_CLEAN_CARS_TUTORIAL_LISTING_LIMIT_9 = 'cars_subscription_tutorial_listinglimit9',
  TO_CLEAN_CARS_TUTORIAL_LISTING_LIMIT_15 = 'cars_subscription_tutorial_listinglimit15',
  TO_CLEAN_CARS_TUTORIAL_DESCRIPTION_2 = 'cars_subscription_tutorial_description2',
  TO_CLEAN_PRO_TUTORIAL_EXTRA_PHONE_WEB = 'pro_subscription_tutorial_extra_fields_phone_web',
  TO_CLEAN_PRO_TUTORIAL_EXTRA_DIRECTION_DESCRIPTION = 'pro_subscription_tutorial_extra_fields_description_direction',
  TO_CLEAN_CARS_TUTORIAL_DESCRIPTION_3 = 'cars_subscription_tutorial_description3',
  TO_CLEAN_PRO_TUTORIAL_NO_EXPIRE = 'pro_subscription_tutorial_items_no_expire',
  TO_CLEAN_CARS_TUTORIAL_PHONE_ON_CAR = 'cars_subscription_tutorial_phone_on_car',
  TO_CLEAN_BRAND = 'brand',
  TO_CLEAN_MODEL = 'model',
  TO_CLEAN_PHONES_BRAND_EXAMPLE = 'phones_brand_example',
  TO_CLEAN_FASHION_BRAND_EXAMPLE = 'fashion_brand_example',
  TO_CLEAN_MODEL_EXAMPLE = 'model_example',
  TO_CLEAN_REVIEWS = 'reviews',
  TO_CLEAN_ERROR_SAVING_DATA = 'errorSavingData',
  TO_CLEAN_CITY_BUMP = 'citybump',
}
