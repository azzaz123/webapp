import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from '@core/item/item';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { APP_PATHS } from 'app/app-routing-constants';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'tsl-public-item-card-list',
  templateUrl: './item-card-list.component.html',
  styleUrls: ['./item-card-list.component.scss'],
})
export class ItemCardListComponent {
  @Input() items: Item[];
  @Input() showDescription = true;

  constructor(
    private deviceDetectionService: DeviceDetectorService,
    private itemCardService: ItemCardService,
    private checkSessionService: CheckSessionService,
    private router: Router
  ) {
    this.showDescription = !this.deviceDetectionService.isMobile();
  }

  public toggleFavourite(item: Item): void {
    this.checkSessionService.hasSession() ? this.itemCardService.toggleFavourite(item) : this.checkSessionService.checkSessionAction();
  }

  public openItemDetailPage(item: Item): void {
    this.router.navigate([`${APP_PATHS.PUBLIC}/${PUBLIC_PATHS.ITEM_DETAIL}/${item.id}`]);
  }
}
