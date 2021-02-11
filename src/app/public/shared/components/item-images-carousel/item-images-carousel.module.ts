import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagesCarouselModule } from '../images-carousel/images-carousel.module';
import { ItemFlagModule } from '../item-flag/item-flag.module';
import { ItemImagesCarouselComponent } from './item-images-carousel.component';

@NgModule({
  declarations: [ItemImagesCarouselComponent],
  imports: [CommonModule, ImagesCarouselModule, ItemFlagModule],
  exports: [ItemImagesCarouselComponent],
})
export class ItemImagesCarouselModule {}
