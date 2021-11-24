import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingHeaderComponent } from './transaction-tracking-header.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { ButtonModule } from '@shared/button/button.module';

@NgModule({
  declarations: [TransactionTrackingHeaderComponent],
  exports: [TransactionTrackingHeaderComponent],
  imports: [CommonModule, SvgIconModule, ButtonModule],
  providers: [],
})
export class TransactionTrackingHeaderModule {}
