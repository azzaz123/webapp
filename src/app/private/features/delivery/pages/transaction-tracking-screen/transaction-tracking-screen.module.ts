import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  transactionTrackingScreenRoutedComponents,
  TransactionTrackingScreenRoutingModule,
} from './transaction-tracking-screen.routing.module';

@NgModule({
  imports: [TransactionTrackingScreenRoutingModule, CommonModule],
  declarations: [transactionTrackingScreenRoutedComponents],
})
export class TransactionTrackingScreenModule {}
