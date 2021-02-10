import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlidesCarouselModule } from '../slides-carousel/slides-carousel.module';
import { ItemFlagModule } from '../item-flag/item-flag.module';
import { ItemImagesCarouselComponent } from './item-images-carousel.component';

@NgModule({
  declarations: [ItemImagesCarouselComponent],
  imports: [CommonModule, SlidesCarouselModule, ItemFlagModule],
  exports: [ItemImagesCarouselComponent],
})
export class ItemImagesCarouselModule {}
