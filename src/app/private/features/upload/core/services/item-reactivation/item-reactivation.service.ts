import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Toast, TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';

@Injectable()
export class ItemReactivationService {
  private toastValidationError: Toast = {
    text: $localize`:@@web_upload_seller_reactivation_toast_text:Reactivate your item by completing the new mandatory information fields.`,
    title: $localize`:@@web_upload_seller_reactivation_toast_title:Add mandatory info`,
    type: TOAST_TYPES.ERROR,
  };
  constructor(private toastService: ToastService) {}

  public reactivationValidation(form: FormGroup): void {
    if (!form.valid) {
      this.toastService.show(this.toastValidationError);

      setTimeout(() => {
        form.markAsPending();
      });
    }
  }
}
