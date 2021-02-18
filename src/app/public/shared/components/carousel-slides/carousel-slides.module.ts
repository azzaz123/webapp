import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { SlidesCarouselComponent } from './carousel-slides.component';
import { CarouselSliderDirective } from './directives/carousel-slider.directive';

@NgModule({
  declarations: [SlidesCarouselComponent, CarouselSliderDirective],
  imports: [CommonModule, NgbCarouselModule, ImageFallbackModule],
  exports: [SlidesCarouselComponent, CarouselSliderDirective],
})
export class SlidesCarouselModule {}
