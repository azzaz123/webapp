import { Component, Input, OnInit } from '@angular/core';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';

@Component({
  selector: 'tsl-transaction-tracking-action-user-action',
  templateUrl: './transaction-tracking-action-user-action.component.html',
  styleUrls: ['./transaction-tracking-action-user-action.component.scss'],
})
export class TransactionTrackingActionUserActionComponent implements OnInit {
  @Input() userAction: any;

  constructor(private transactionTrackingService: TransactionTrackingService) {}

  ngOnInit(): void {}

  public requestUserAction(): void {
    // this.transactionTrackingService.sendUserAction(payload.parameters.transactionId, payload.name).subscribe(
    //   () => {},
    //   () => {}
    // );
  }
}
