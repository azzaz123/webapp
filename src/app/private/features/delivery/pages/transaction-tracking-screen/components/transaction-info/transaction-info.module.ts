import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionInfoComponent } from './transaction-info.component';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';

@NgModule({
  declarations: [TransactionInfoComponent],
  imports: [CommonModule, ImageFallbackModule],
  exports: [TransactionInfoComponent],
})
export class TransactionInfoModule {}
