import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmPaymentModalComponent } from '@private/shared/delivery-payment-ready/components/confirm-payment-modal/confirm-payment-modal.component';
import { ButtonModule } from '@shared/button/button.module';

@NgModule({
  declarations: [ConfirmPaymentModalComponent],
  imports: [CommonModule, ButtonModule],
})
export class ConfirmPaymentModalModule {}
