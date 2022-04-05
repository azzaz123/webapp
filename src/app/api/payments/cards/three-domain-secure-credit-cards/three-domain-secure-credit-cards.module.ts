import { NgModule } from '@angular/core';
import { WebViewModalModule } from '@shared/web-view-modal/web-view-modal.module';
import { ThreeDomainSecureCreditCardsService } from './three-domain-secure-credit-cards.service';

@NgModule({
  imports: [WebViewModalModule],
  providers: [ThreeDomainSecureCreditCardsService],
})
export class ThreeDomainSecureCreditCardsModule {}
