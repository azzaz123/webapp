import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { I18nService } from '../i18n/i18n.service';

export const DEFAULT_ERROR_MESSAGE = 'Servicio no disponible temporalmente. Inténtelo de nuevo más tarde';

@Injectable()
export class ErrorsService {

  constructor(private toastr: ToastrService,
              private router: Router,
              private i18n: I18nService) {
  }

  show(res: Response, backToLogin: boolean = false): void {
    const error: any = res.json();
    if (error) {
      let message: string;
      if (error[0] && error[0].message) {
        message = error[0].message;
      } else {
        message = error.message ? error.message : DEFAULT_ERROR_MESSAGE;
      }
      this.toastr.error(message, 'Oops!');
      if (backToLogin) {
        this.router.navigate(['/login']);
      }
    }
  }

  i18nError(key: string, contacText: string = '', titleKey?: string) {
    this.toastr.error(this.i18n.getTranslations(key) + contacText, titleKey ? this.i18n.getTranslations(titleKey) : 'Oops!');
  }

  i18nSuccess(key: string, contacText: string = '', titleKey?: string) {
    this.toastr.success(this.i18n.getTranslations(key) + contacText, titleKey ? this.i18n.getTranslations(titleKey) : 'Yup!');
  }
}
