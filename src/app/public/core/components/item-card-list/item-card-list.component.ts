import { Component, Input } from '@angular/core';
import { Item } from '@core/item/item';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'tsl-public-item-card-list',
  templateUrl: './item-card-list.component.html',
  styleUrls: ['./item-card-list.component.scss'],
})
export class ItemCardListComponent {
  @Input() items: Item[];
  public showDescription = true;

  constructor(private deviceDetectionService: DeviceDetectorService) {
    this.showDescription = !this.deviceDetectionService.isMobile();

    console.log(this.deviceDetectionService.isMobile());
  }
}
