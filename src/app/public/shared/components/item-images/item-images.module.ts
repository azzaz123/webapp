import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ItemImagesComponent } from './item-images.component';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';

@NgModule({
  declarations: [ItemImagesComponent],
  imports: [CommonModule, NgbModule, SvgIconModule, ImageFallbackModule],
  exports: [ItemImagesComponent],
})
export class ItemImagesModule {}
