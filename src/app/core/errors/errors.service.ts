import { Injectable } from '@angular/core';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { I18nService } from '../i18n/i18n.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

@Injectable()
export class ErrorsService {
  constructor(private toastService: ToastService, private i18n: I18nService) {}

  show(res: HttpErrorResponse): void {
    const error = res.error;

    if (error) {
      let message: string;
      if (error[0] && error[0].message) {
        message = error[0].message;
      } else {
        message = error.message ? error.message : this.i18n.translate(TRANSLATION_KEY.DEFAULT_ERROR_MESSAGE);
      }
      this.toastService.show({ text: message, title: this.i18n.translate(TRANSLATION_KEY.TOAST_ERROR_TITLE), type: 'error' });
    }
  }

  i18nError(key: TRANSLATION_KEY, concatText: string = '', titleKey?: TRANSLATION_KEY) {
    const translatedText = this.i18n.translate(key);
    const text = `${translatedText ? translatedText : this.i18n.translate(TRANSLATION_KEY.DEFAULT_ERROR_MESSAGE)} ${concatText}`;
    const title = titleKey ? this.i18n.translate(titleKey) : this.i18n.translate(TRANSLATION_KEY.TOAST_ERROR_TITLE);

    this.toastService.show({
      text,
      title,
      type: 'error',
    });
  }

  i18nSuccess(key: string, concatText: string = '', titleKey?: string) {
    const translatedText = this.i18n.getTranslations(key);
    const text = `${translatedText ? translatedText : ''} ${concatText}`;
    const title = titleKey ? this.i18n.getTranslations(titleKey) : this.i18n.translate(TRANSLATION_KEY.TOAST_DEFAULT_SUCCESS_TITLE);

    this.toastService.show({
      text,
      title,
      type: 'success',
    });
  }
}
