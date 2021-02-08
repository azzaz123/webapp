import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { FavouriteIconModule } from '@public/shared/components/favourite-icon/favourite-icon.module';
import { ImagesCarouselModule } from '@public/shared/components/images-carousel/images-carousel.module';
import { ButtonModule } from '@shared/button/button.module';
import { ItemDetailImagesCarouselComponent } from './item-detail-images-carousel.component';

@NgModule({
  declarations: [ItemDetailImagesCarouselComponent],
  imports: [CommonModule, FavouriteIconModule, ImagesCarouselModule, ButtonModule, SvgIconModule],
  exports: [ItemDetailImagesCarouselComponent],
})
export class ItemDetailImagesCarouselModule {}
