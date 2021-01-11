import { Component, Input } from '@angular/core';
import { Item } from '@core/item/item';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'tsl-public-item-card-list',
  templateUrl: './item-card-list.component.html',
  styleUrls: ['./item-card-list.component.scss'],
})
export class ItemCardListComponent {
  @Input() items: Item[];
  public showDescription = true;

  constructor(
    private deviceDetectionService: DeviceDetectorService,
    private itemCardService: ItemCardService,
    private checkSessionService: CheckSessionService
  ) {
    this.showDescription = !this.deviceDetectionService.isMobile();
  }

  public toggleFavourite(item: Item): void {
    this.checkSessionService.hasSession()
      ? this.itemCardService.toggleFavourite(item)
      : this.checkSessionService.checkSessionAction();
  }
}
