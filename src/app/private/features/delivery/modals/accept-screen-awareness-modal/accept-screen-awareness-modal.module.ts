import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@shared/button/button.module';
import { LottieModule } from '@shared/lottie/lottie.module';
import { AcceptScreenAwarenessModalComponent } from './accept-screen-awareness-modal.component';

@NgModule({
  declarations: [AcceptScreenAwarenessModalComponent],
  imports: [CommonModule, ButtonModule, LottieModule],
})
export class AcceptScreenAwarenessModalModule {}
