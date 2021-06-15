import { COLORS } from '@core/colors/colors-constants';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

export interface ConfirmationModalProperties {
  title?: string;
  description: string;
  confirmMessage: string;
  cancelMessage?: string;
  confirmColor: COLORS.WALLA_MAIN | COLORS.NEGATIVE_MAIN;
}

export interface ConfirmationModalKeyProperties {
  title?: TRANSLATION_KEY;
  description: TRANSLATION_KEY;
  confirmMessage: TRANSLATION_KEY;
  cancelMessage?: TRANSLATION_KEY;
}
