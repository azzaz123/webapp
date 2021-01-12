import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ItemImagesComponent } from './item-images.component';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';

@NgModule({
  declarations: [ItemImagesComponent],
  imports: [CommonModule, NgbModule, SvgIconModule],
  exports: [ItemImagesComponent],
})
export class ItemImagesModule {}
