import { NgModule } from '@angular/core';
import { RequestsAndTransactionsPendingHttpService } from './http/requests-and-transactions-pending-http.service';
import { RequestsAndTransactionsPendingService } from './requests-and-transactions-pending.service';

@NgModule({
  providers: [RequestsAndTransactionsPendingHttpService, RequestsAndTransactionsPendingService],
})
export class RequestAndTransactionsPendingModule {}
