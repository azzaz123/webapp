import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionDetailComponent } from './transaction-detail.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';

@NgModule({
  declarations: [TransactionDetailComponent],
  imports: [CommonModule, SvgIconModule, ImageFallbackModule],
  exports: [TransactionDetailComponent],
})
export class TransactionDetailModule {}
