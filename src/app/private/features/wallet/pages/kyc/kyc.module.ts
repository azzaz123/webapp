import { NgModule } from '@angular/core';
import { KycInfoSliderComponent } from './components/kyc-info-slider/kyc-info-slider.component';
import { KYCRoutedComponents, KYCRoutingModule } from './kyc.routing.module';
import { SlidesCarouselModule } from '@shared/components/carousel-slides/carousel-slides.module';
import { ButtonModule } from '@shared/button/button.module';
import { CommonModule } from '@angular/common';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  imports: [CommonModule, KYCRoutingModule, SlidesCarouselModule, ButtonModule, SvgIconModule],
  declarations: [KYCRoutedComponents, KycInfoSliderComponent],
})
export class KYCModule {}
