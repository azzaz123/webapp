import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from '@core/item/item';
import { TypeCheckService } from '@public/core/services/type-check/type-check.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'tsl-item-wide-card',
  templateUrl: './item-wide-card.component.html',
  styleUrls: ['./item-wide-card.component.scss'],
})
export class ItemWideCardComponent {
  @Input() item: Item;
  @Input() itemExtraInfo: string[];
  @Input() showFavourite = true;

  @Output() toggleFavourite: EventEmitter<void> = new EventEmitter<void>();
  @Output() itemClick: EventEmitter<void> = new EventEmitter<void>();

  constructor(public typeCheckService: TypeCheckService, public deviceDetectorService: DeviceDetectorService) {}

  public toggleItemFavorite(event: Event): void {
    event.stopPropagation();
    this.toggleFavourite.emit();
  }
}
