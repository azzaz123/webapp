import { NgModule } from '@angular/core';
import { SlidesCarouselModule } from '@shared/components/carousel-slides/carousel-slides.module';
import { ButtonModule } from '@shared/button/button.module';
import { CommonModule } from '@angular/common';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { KycInfoModalComponent } from './kyc-info-modal.component';

@NgModule({
  imports: [CommonModule, SlidesCarouselModule, ButtonModule, SvgIconModule],
  exports: [KycInfoModalComponent],
  declarations: [KycInfoModalComponent],
})
export class KYCInfoSliderModule {}
