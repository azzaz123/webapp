import { NgModule } from '@angular/core';
import { KycInfoSliderComponent } from './components/kyc-info-slider/kyc-info-slider.component';
import { KYCRoutedComponents, KYCRoutingModule } from './kyc.routing.module';
import { SlidesCarouselModule } from '@shared/components/carousel-slides/carousel-slides.module';

@NgModule({
  imports: [KYCRoutingModule, SlidesCarouselModule],
  declarations: [KYCRoutedComponents, KycInfoSliderComponent],
})
export class KYCModule {}
