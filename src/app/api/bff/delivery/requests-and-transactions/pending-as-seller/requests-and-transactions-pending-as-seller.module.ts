import { NgModule } from '@angular/core';
import { RequestsAndTransactionsPendingAsSellerHttpService } from './http/requests-and-transactions-pending-as-seller-http.service';
import { RequestsAndTransactionsPendingAsSellerService } from './requests-and-transactions-pending-as-seller.service';

@NgModule({
  providers: [RequestsAndTransactionsPendingAsSellerHttpService, RequestsAndTransactionsPendingAsSellerService],
})
export class RequestAndTransactionsPendingAsSellerModule {}
