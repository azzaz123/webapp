import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@shared/button/button.module';
import { TransactionTrackingActionSelectorModule } from '../../components/transaction-tracking-action-details/transaction-tracking-action-selector/transaction-tracking-action-selector.module';
import { ConfirmationActionModalComponent } from './confirmation-action-modal.component';

@NgModule({
  declarations: [ConfirmationActionModalComponent],
  imports: [CommonModule, ButtonModule, TransactionTrackingActionSelectorModule],
})
export class ConfirmationActionModalModule {}
