import { NgModule } from '@angular/core';
import { ContinueToPayPalService } from './services/continue-to-pay-pal.service';
import { ContinueToPayPalModalModule } from './modals/continue-to-paypal/continue-to-paypal-modal.module';

@NgModule({
  imports: [ContinueToPayPalModalModule],
  providers: [ContinueToPayPalService],
})
export class ContinueToPayPalModule {}
