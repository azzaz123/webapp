import { Injectable } from '@angular/core';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { I18nService } from '../i18n/i18n.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

@Injectable()
export class ErrorsService {
  constructor(private toastService: ToastService, private i18n: I18nService) {}

  public show(res: HttpErrorResponse): void {
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

  public i18nError(key: TRANSLATION_KEY, concatText: string = '', titleKey?: TRANSLATION_KEY): void {
    this.showToast('error', key, concatText, titleKey);
  }

  public i18nSuccess(key: TRANSLATION_KEY, concatText: string = '', titleKey?: TRANSLATION_KEY): void {
    this.showToast('success', key, concatText, titleKey);
  }

  private showToast(type: 'error' | 'success', key: TRANSLATION_KEY, concatText: string, titleKey?: TRANSLATION_KEY): void {
    const translatedText = this.i18n.translate(key) || this.i18n.translate(TRANSLATION_KEY.DEFAULT_ERROR_MESSAGE);
    const spacedConcatText = concatText ? ` ${concatText}` : '';

    const text = `${translatedText}${spacedConcatText}`;
    const title = titleKey ? this.i18n.translate(titleKey) : this.i18n.translate(TRANSLATION_KEY.TOAST_DEFAULT_SUCCESS_TITLE);

    this.toastService.show({
      text,
      title,
      type,
    });
  }
}
