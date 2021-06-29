import { Injectable } from '@angular/core';
import { translations } from './translations/constants/translations';
import { TRANSLATION_KEY } from './translations/enum/translation-keys.enum';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  public translate(translationKey: TRANSLATION_KEY): string {
    return translations[translationKey] || '';
  }
}
