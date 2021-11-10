import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingGeneralInfoComponent } from './transaction-tracking-general-info.component';
import { LottieModule } from '@shared/lottie/lottie.module';

@NgModule({
  declarations: [TransactionTrackingGeneralInfoComponent],
  imports: [CommonModule, LottieModule],
})
export class TransactionTrackingGeneralInfoModule {}
