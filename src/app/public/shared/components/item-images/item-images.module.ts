import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ItemImagesComponent } from './item-images.component';

@NgModule({
  declarations: [ItemImagesComponent],
  imports: [CommonModule, NgbModule],
  exports: [ItemImagesComponent],
})
export class ItemImagesModule {}
