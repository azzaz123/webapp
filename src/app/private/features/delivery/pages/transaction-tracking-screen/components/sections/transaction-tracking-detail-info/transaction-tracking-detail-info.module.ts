import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingDetailInfoComponent } from './transaction-tracking-detail-info.component';
import { TransactionDetailModule } from '../../transaction-detail/transaction-detail.module';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { TransactionInfoModule } from '../../transaction-info/transaction-info.module';

@NgModule({
  declarations: [TransactionTrackingDetailInfoComponent],
  imports: [CommonModule, TransactionDetailModule, NgbAccordionModule, SvgIconModule, TransactionInfoModule],
  exports: [TransactionTrackingDetailInfoComponent],
})
export class TransactionTrackingDetailInfoModule {}
