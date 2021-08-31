import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { KYCStatusModule } from '../kyc/components/kyc-status/kyc-status.module';

@NgModule({
  imports: [CommonModule, KYCStatusModule],
})
export class KYCStatusModalModule {}
