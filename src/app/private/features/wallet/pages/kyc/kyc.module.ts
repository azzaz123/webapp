import { NgModule } from '@angular/core';
import { KYCRoutedComponents, KYCRoutingModule } from './kyc.routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, KYCRoutingModule],
  declarations: [KYCRoutedComponents],
})
export class KYCModule {}
