import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PERMISSIONS } from '@core/user/user-constants';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { TypeCheckService } from '@public/core/services/type-check/type-check.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'tsl-item-card-wide',
  templateUrl: './item-card-wide.component.html',
  styleUrls: ['./item-card-wide.component.scss'],
})
export class ItemCardWideComponent {
  @Input() item: ItemCard;
  @Input() itemExtraInfo: string[];
  @Input() showFavourite = true;

  @Output() toggleFavourite: EventEmitter<void> = new EventEmitter<void>();

  public readonly PERMISSIONS = PERMISSIONS;

  constructor(public typeCheckService: TypeCheckService, public deviceDetectorService: DeviceDetectorService) {}

  public toggleItemFavorite(event: Event): void {
    event.stopPropagation();
    this.toggleFavourite.emit();
  }
}
