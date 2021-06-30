import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlidesCarouselModule } from '@shared/components/carousel-slides/carousel-slides.module';
import { ItemFlagModule } from '../item-flag/item-flag.module';
import { ItemImagesCarouselComponent } from './item-images-carousel.component';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [ItemImagesCarouselComponent],
  imports: [CommonModule, SlidesCarouselModule, ItemFlagModule, NgxPermissionsModule.forChild()],
  exports: [ItemImagesCarouselComponent],
})
export class ItemImagesCarouselModule {}
