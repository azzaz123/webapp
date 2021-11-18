import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionInfoComponent } from './transaction-info.component';

@NgModule({
  declarations: [TransactionInfoComponent],
  imports: [CommonModule],
  exports: [TransactionInfoComponent],
})
export class TransactionInfoModule {}
