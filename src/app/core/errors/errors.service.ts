import { Injectable } from '@angular/core';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { I18nService } from '../i18n/i18n.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';

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
      this.toastService.show({ text: message, title: this.i18n.translate(TRANSLATION_KEY.TOAST_ERROR_TITLE), type: TOAST_TYPES.ERROR });
    }
  }

  public i18nError(key: TRANSLATION_KEY, concatText: string = '', titleKey?: TRANSLATION_KEY): void {
    const title = titleKey ? this.i18n.translate(titleKey) : this.i18n.translate(TRANSLATION_KEY.TOAST_ERROR_TITLE);
    this.showToast(TOAST_TYPES.ERROR, key, concatText, title);
  }

  public i18nSuccess(key: TRANSLATION_KEY, concatText: string = '', titleKey?: TRANSLATION_KEY): void {
    const title = titleKey ? this.i18n.translate(titleKey) : this.i18n.translate(TRANSLATION_KEY.TOAST_DEFAULT_SUCCESS_TITLE);
    this.showToast(TOAST_TYPES.SUCCESS, key, concatText, title);
  }

  private showToast(type: TOAST_TYPES, key: TRANSLATION_KEY, concatText: string, title: string): void {
    const translatedText = this.i18n.translate(key) || this.i18n.translate(TRANSLATION_KEY.DEFAULT_ERROR_MESSAGE);
    const spacedConcatText = concatText ? ` ${concatText}` : '';

    const text = `${translatedText}${spacedConcatText}`;

    this.toastService.show({
      text,
      title,
      type,
    });
  }
}
