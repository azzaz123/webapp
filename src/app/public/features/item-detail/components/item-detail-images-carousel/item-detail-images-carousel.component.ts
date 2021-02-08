import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tsl-item-detail-images-carousel',
  templateUrl: './item-detail-images-carousel.component.html',
  styleUrls: ['./item-detail-images-carousel.component.scss'],
})
export class ItemDetailImagesCarouselComponent implements OnInit {
  public hidden = true;
  @Input() images: string[];
  @Input() imageIndex: number;

  constructor() {}

  ngOnInit(): void {}

  public show(): void {
    this.hidden = false;
  }
}
