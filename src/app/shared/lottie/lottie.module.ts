import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LottieComponent } from './lottie.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  declarations: [LottieComponent],
  imports: [CommonModule, SvgIconModule],
  exports: [LottieComponent],
})
export class LottieModule {}
