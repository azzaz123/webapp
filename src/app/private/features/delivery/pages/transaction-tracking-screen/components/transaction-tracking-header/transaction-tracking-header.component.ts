import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TransactionTrackingActionsService } from '@private/features/delivery/services/transaction-tracking/transaction-tracking-actions/transaction-tracking-actions.service';
import { TransactionTrackingHeader } from '../../interfaces/transaction-tracking-header.interface';

@Component({
  selector: 'tsl-transaction-tracking-header',
  templateUrl: './transaction-tracking-header.component.html',
  styleUrls: ['./transaction-tracking-header.component.scss'],
})
export class TransactionTrackingHeaderComponent {
  @Input() transactionTrackingHeader: TransactionTrackingHeader;
  @Output() backClick: EventEmitter<void> = new EventEmitter();

  constructor(private transactionTrackingActionsService: TransactionTrackingActionsService) {}

  public manageAction(action: any): void {
    this.transactionTrackingActionsService.manageAction(action);
  }
}
