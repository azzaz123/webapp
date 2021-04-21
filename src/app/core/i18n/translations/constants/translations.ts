import { TRANSLATION_KEY } from '../enum/translation-keys.enum';
import { Translations } from '../interfaces/translations.interface';

export const translations: Translations = {
  [TRANSLATION_KEY.CONSUMER_GOODS_GENERAL_CATEGORY_TITLE]: $localize`:@@web_consumer_goods_category_name:Everything else`,
  [TRANSLATION_KEY.CHAT_DESKTOP_NOTIFICATION_TITLE]: $localize`:@@web_chat_desktop_notification:New message from`,
};
