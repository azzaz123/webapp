import { NgModule } from '@angular/core';
import { TransactionsHistoryHttpService } from './http/transactions-history-http.service';
import { TransactionsHistoryApiService } from './transactions-history-api.service';

@NgModule({
  providers: [TransactionsHistoryHttpService, TransactionsHistoryApiService],
})
export class TransactionsHistoryModule {}
