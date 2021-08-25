import { NgModule } from '@angular/core';
import { UuidService } from '@core/uuid/uuid.service';
import { KYCHttpService } from './http/kyc-http.service';
import { KYCService } from './kyc.service';

@NgModule({
  providers: [KYCService, KYCHttpService, UuidService],
})
export class KYCServicesModule {}
