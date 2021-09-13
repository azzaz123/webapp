import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from '@shared/button/button.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { KYCStatusComponent } from './kyc-status.component';

@NgModule({
  imports: [CommonModule, ButtonModule, SvgIconModule],
  declarations: [KYCStatusComponent],
  exports: [KYCStatusComponent],
})
export class KYCStatusModule {}
