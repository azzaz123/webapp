import { NgModule } from '@angular/core';
import {
  transactionTrackingScreenRoutedComponents,
  TransactionTrackingScreenRoutingModule,
} from './transaction-tracking-screen.routing.module';

@NgModule({
  imports: [TransactionTrackingScreenRoutingModule],
  declarations: [transactionTrackingScreenRoutedComponents],
})
export class TransactionTrackingScreenModule {}
