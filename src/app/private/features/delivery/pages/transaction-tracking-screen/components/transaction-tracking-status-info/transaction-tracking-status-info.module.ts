import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { TransactionTrackingStatusInfoComponent } from './transaction-tracking-status-info.component';

@NgModule({
  declarations: [TransactionTrackingStatusInfoComponent],
  imports: [CommonModule, SvgIconModule, ImageFallbackModule],
  exports: [TransactionTrackingStatusInfoComponent],
})
export class TransactionTrackingStatusInfoModule {}
