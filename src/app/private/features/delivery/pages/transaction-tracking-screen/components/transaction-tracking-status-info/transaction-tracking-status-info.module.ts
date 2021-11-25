import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { TransactionTrackingStatusInfoComponent } from './transaction-tracking-status-info.component';
import { TransactionTrackingActionSelectorModule } from '../transaction-tracking-action-details/transaction-tracking-action-selector/transaction-tracking-action-selector.module';
import { BypassHTMLModule } from '@shared/pipes/bypass-html/bypass-html.module';

@NgModule({
  declarations: [TransactionTrackingStatusInfoComponent],
  imports: [CommonModule, SvgIconModule, ImageFallbackModule, TransactionTrackingActionSelectorModule, BypassHTMLModule],
  exports: [TransactionTrackingStatusInfoComponent],
})
export class TransactionTrackingStatusInfoModule {}
