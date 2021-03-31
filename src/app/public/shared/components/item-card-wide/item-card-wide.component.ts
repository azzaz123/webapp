import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from '@core/item/item';
import { TypeCheckService } from '@public/core/services/type-check/type-check.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ItemCardWide } from './interfaces/item-card-wide.interface';

@Component({
  selector: 'tsl-item-card-wide',
  templateUrl: './item-card-wide.component.html',
  styleUrls: ['./item-card-wide.component.scss'],
})
export class ItemCardWideComponent {
  @Input() item: ItemCardWide;
  @Input() itemExtraInfo: string[];
  @Input() showFavourite = true;

  @Output() toggleFavourite: EventEmitter<void> = new EventEmitter<void>();

  constructor(public typeCheckService: TypeCheckService, public deviceDetectorService: DeviceDetectorService) {}

  public toggleItemFavorite(event: Event): void {
    event.stopPropagation();
    this.toggleFavourite.emit();
  }
}
