import { Component, Input } from '@angular/core';
import { Item } from '@core/item/item';

@Component({
  selector: 'tsl-item-detail-images-carousel',
  templateUrl: './item-detail-images-carousel.component.html',
  styleUrls: ['./item-detail-images-carousel.component.scss'],
})
export class ItemDetailImagesCarouselComponent {
  public hidden = true;
  @Input() item: Item;
  @Input() images: string[];
  @Input() imageIndex: number;

  public show(): void {
    this.hidden = false;
  }
}
