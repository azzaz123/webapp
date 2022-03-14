import { NgModule } from '@angular/core';
import { WebViewModalModule } from '@shared/web-view-modal/web-view-modal.module';
import { ThreeDomainSecureService } from './three-domain-secure.service';

@NgModule({
  imports: [WebViewModalModule],
  providers: [ThreeDomainSecureService],
})
export class ThreeDomainSecureModule {}
