import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ImagesCarouselComponent } from './images-carousel.component';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { PublicSharedModule } from '@public/shared/public-shared.module';

@NgModule({
  declarations: [ImagesCarouselComponent],
  imports: [
    CommonModule,
    NgbCarouselModule,
    ImageFallbackModule,
    PublicSharedModule,
  ],
  exports: [ImagesCarouselComponent],
})
export class ImagesCarouselModule {}
