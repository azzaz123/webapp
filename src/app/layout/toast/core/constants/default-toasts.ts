import { translations } from '@core/i18n/translations/constants/translations';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { Toast, TOAST_TYPES } from '../interfaces/toast.interface';

export const DEFAULT_ERROR_TOAST: Toast = {
  type: TOAST_TYPES.ERROR,
  title: translations[TRANSLATION_KEY.TOAST_ERROR_TITLE],
  text: translations[TRANSLATION_KEY.DEFAULT_ERROR_MESSAGE],
};
