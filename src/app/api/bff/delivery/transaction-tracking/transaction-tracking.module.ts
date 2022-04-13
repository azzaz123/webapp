import { NgModule } from '@angular/core';
import { TransactionTrackingService } from './transaction-tracking.service';
import { TransactionTrackingHttpService } from './http/transaction-tracking-http.service';

@NgModule({
  providers: [TransactionTrackingService, TransactionTrackingHttpService],
})
export class TransactionTrackingModule {}
