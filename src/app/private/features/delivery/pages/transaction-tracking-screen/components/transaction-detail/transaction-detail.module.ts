import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionDetailComponent } from './transaction-detail.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  declarations: [TransactionDetailComponent],
  imports: [CommonModule, SvgIconModule],
  exports: [TransactionDetailComponent],
})
export class TransactionDetailModule {}
