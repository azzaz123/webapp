import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TransactionTrackingInstructionsRoutedComponents,
  TransactionTrackingInstructionsRoutingModule,
} from './transaction-tracking-instructions.routing.module';

@NgModule({
  declarations: [TransactionTrackingInstructionsRoutedComponents],
  imports: [CommonModule, TransactionTrackingInstructionsRoutingModule],
})
export class TransactionTrackingInstructionsModule {}
