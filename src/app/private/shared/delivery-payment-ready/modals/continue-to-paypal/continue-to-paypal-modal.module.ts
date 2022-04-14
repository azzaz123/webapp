import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@shared/button/button.module';
import { ContinueToPayPalComponent } from './continue-to-paypal-modal.component';

@NgModule({
  declarations: [ContinueToPayPalComponent],
  imports: [CommonModule, ButtonModule],
})
export class ContinueToPayPalModule {}
