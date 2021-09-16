import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { KYCStatusModule } from '../kyc/components/kyc-status/kyc-status.module';
import { KYCStatusModalComponent } from './kyc-status-modal.component';

@NgModule({
  imports: [CommonModule, KYCStatusModule, SvgIconModule],
  declarations: [KYCStatusModalComponent],
  exports: [KYCStatusModalComponent],
})
export class KYCStatusModalModule {}
