import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() showFavourite = true;

  @Output() toggleFavourite: EventEmitter<void> = new EventEmitter<void>();

  constructor(public typeCheckService: TypeCheckService, public deviceDetectorService: DeviceDetectorService) {}

  public toggleItemFavorite(event: Event): void {
    event.stopPropagation();
    this.toggleFavourite.emit();
  }
}
