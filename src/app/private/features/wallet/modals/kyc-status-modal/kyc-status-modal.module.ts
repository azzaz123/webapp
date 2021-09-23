import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { KYCAckHttpService } from '@api/bff/delivery/kyc-ack/http/kyc-ack-http.service';
import { KYCAckService } from '@api/bff/delivery/kyc-ack/kyc-ack.service';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { KYCStatusModule } from '../kyc/components/kyc-status/kyc-status.module';
import { KYCStatusModalComponent } from './kyc-status-modal.component';

@NgModule({
  imports: [CommonModule, KYCStatusModule, SvgIconModule],
  declarations: [KYCStatusModalComponent],
  exports: [KYCStatusModalComponent],
  providers: [KYCAckService, KYCAckHttpService],
})
export class KYCStatusModalModule {}
