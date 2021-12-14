import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@shared/button/button.module';
import { LottieModule } from '@shared/lottie/lottie.module';
import { TRXAwarenessModalComponent } from './trx-awareness-modal.component';

@NgModule({
  declarations: [TRXAwarenessModalComponent],
  imports: [CommonModule, ButtonModule, LottieModule],
})
export class TRXAwarenessModalModule {}
