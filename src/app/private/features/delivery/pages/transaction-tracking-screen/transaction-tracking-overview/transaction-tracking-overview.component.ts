import { Component, OnInit } from '@angular/core';
import { TransactionTrackingInfo } from '@private/features/delivery/interfaces/tts/transaction-tracking-info.interface';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tsl-transaction-tracking-overview',
  templateUrl: './transaction-tracking-overview.component.html',
  styleUrls: ['./transaction-tracking-overview.component.scss'],
})
export class TransactionTrackingOverviewComponent implements OnInit {
  public transactionTracking$: Observable<any> = of(null);
  public statusInfoProperties$: Observable<TransactionTrackingInfo[]>;

  constructor() {}

  ngOnInit(): void {
    this.initializeStatusInfoProperties();
  }

  public initializeStatusInfoProperties(): void {
    this.transactionTracking$.pipe(
      map((transactionTracking: any) => {
        const propertiesMapped: TransactionTrackingInfo[] = [];
        transactionTracking.statusInfo.foreach((slot: any) => {
          propertiesMapped.push({
            description: slot.description,
            iconSrc: slot.icon.url,
            showCaret: slot.showCaret,
            iconClassName: slot.style.className,
          });
          return propertiesMapped;
        });
      })
    );
  }
}
