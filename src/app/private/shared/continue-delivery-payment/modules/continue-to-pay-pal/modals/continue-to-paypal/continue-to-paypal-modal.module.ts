import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@shared/button/button.module';
import { ContinueToPayPalModalComponent } from './continue-to-paypal-modal.component';

@NgModule({
  declarations: [ContinueToPayPalModalComponent],
  imports: [CommonModule, ButtonModule],
})
export class ContinueToPayPalModalModule {}
