import { NgModule } from '@angular/core';
import { KYCAckHttpService } from './http/kyc-ack-http.service';
import { KYCAckService } from './kyc-ack.service';

@NgModule({
  providers: [KYCAckHttpService, KYCAckService],
})
export class KYCAckModule {}
