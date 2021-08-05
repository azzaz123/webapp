import { NgModule } from '@angular/core';
import { KYCHttpService } from './http/kyc-http.service';
import { KYCService } from './kyc.service';

@NgModule({
  providers: [KYCService, KYCHttpService],
})
export class KYCServicesModule {}
