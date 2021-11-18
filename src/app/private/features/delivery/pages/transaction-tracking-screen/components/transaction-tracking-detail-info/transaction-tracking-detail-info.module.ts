import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingDetailInfoComponent } from './transaction-tracking-detail-info.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  declarations: [TransactionTrackingDetailInfoComponent],
  imports: [CommonModule, SvgIconModule],
  exports: [TransactionTrackingDetailInfoComponent],
})
export class TransactionTrackingDetailInfoModule {}
