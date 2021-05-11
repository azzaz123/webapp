import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { translations } from './translations/constants/translations';
import { TRANSLATION_KEY } from './translations/enum/translation-keys.enum';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  constructor(@Inject(LOCALE_ID) private _locale: string) {}

  get locale() {
    return this._locale === 'en-US' ? 'en' : this._locale;
  }

  public translate(translationKey: TRANSLATION_KEY): string {
    return translations[translationKey] || '';
  }
}
