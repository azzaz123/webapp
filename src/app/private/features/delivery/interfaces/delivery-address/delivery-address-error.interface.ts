import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

export enum ADDRESS_ERROR_TYPE {
  TOAST,
  FORM,
}

export interface AddressError {
  translationKey: TRANSLATION_KEY;
  type: ADDRESS_ERROR_TYPE;
  formControlName: string;
  translation: string;
}
