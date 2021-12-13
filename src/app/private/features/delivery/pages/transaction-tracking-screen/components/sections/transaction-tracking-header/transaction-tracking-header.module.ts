import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingHeaderComponent } from './transaction-tracking-header.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { ButtonModule } from '@shared/button/button.module';
import { TransactionTrackingActionSelectorModule } from '../../transaction-tracking-action-details/transaction-tracking-action-selector/transaction-tracking-action-selector.module';

@NgModule({
  declarations: [TransactionTrackingHeaderComponent],
  exports: [TransactionTrackingHeaderComponent],
  imports: [CommonModule, SvgIconModule, ButtonModule, TransactionTrackingActionSelectorModule],
})
export class TransactionTrackingHeaderModule {}
