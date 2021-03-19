import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Car } from '@core/item/car';
import { Realestate } from '@core/item/realestate';
import { TypeCheckService } from '@public/core/services/type-check/type-check.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'tsl-item-wide-card',
  templateUrl: './item-wide-card.component.html',
  styleUrls: ['./item-wide-card.component.scss'],
})
export class ItemWideCardComponent {
  @Input() item: Car | Realestate;
  @Input() itemExtraInfo: string[];
  @Input() showFavourite = true;

  @Output() toggleFavourite: EventEmitter<void> = new EventEmitter<void>();
  @Output() itemClick: EventEmitter<void> = new EventEmitter<void>();

  constructor(public typeCheckService: TypeCheckService, public deviceDetectorService: DeviceDetectorService) {}
}
