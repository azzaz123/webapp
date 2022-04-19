import { NgModule } from '@angular/core';
import { WebViewModalModule } from '@shared/web-view-modal/web-view-modal.module';
import { ContinueWithCreditCardService } from './services/continue-with-credit-card.service';

@NgModule({
  imports: [WebViewModalModule],
  providers: [ContinueWithCreditCardService],
})
export class ContinueWithCreditCardModule {}
