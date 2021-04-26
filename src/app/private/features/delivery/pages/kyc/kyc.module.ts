import { NgModule } from '@angular/core';
import { KYCRoutedComponents, KYCRoutingModule } from './kyc.routing.module';

@NgModule({
  imports: [KYCRoutingModule],
  declarations: [KYCRoutedComponents],
})
export class KYCModule {}
