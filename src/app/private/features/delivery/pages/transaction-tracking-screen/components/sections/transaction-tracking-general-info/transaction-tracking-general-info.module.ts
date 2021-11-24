import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingGeneralInfoComponent } from './transaction-tracking-general-info.component';
import { LottieModule } from '@shared/lottie/lottie.module';
import { ButtonModule } from '@shared/button/button.module';
import { BypassHTMLModule } from '@shared/pipes/bypass-html/bypass-html.module';

@NgModule({
  declarations: [TransactionTrackingGeneralInfoComponent],
  imports: [CommonModule, LottieModule, ButtonModule, BypassHTMLModule],
  providers: [],
  exports: [TransactionTrackingGeneralInfoComponent],
})
export class TransactionTrackingGeneralInfoModule {}
