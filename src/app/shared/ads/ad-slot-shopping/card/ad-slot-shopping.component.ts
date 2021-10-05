import { Component, Input, OnInit } from '@angular/core';
import { AD_SHOPPING_STYLE_ID_DESKTOP, AD_SHOPPING_STYLE_ID_MOBILE, AD_SHOPPING_STYLE_ID_WIDE } from '@core/ads/constants';
import { AdShoppingPageOptions, AdSlotShoppingConfiguration } from '@core/ads/models';
import { DeviceService } from '@core/device/device.service';
import { CARD_TYPES } from '@public/shared/components/item-card-list/enums/card-types.enum';
import { AD_SHOPPING_CONTAINER_PUBLIC_SEARCH } from '@public/features/search/core/ads/shopping/search-ads-shopping.config';

@Component({
  selector: 'tsl-sky-shopping',
  templateUrl: 'ad-slot-shopping.component.html',
  styleUrls: ['./ad-slot-shopping.component.scss'],
})
export class AdSlotShoppingComponent implements OnInit {
  @Input() adShoppingPageOptions: AdShoppingPageOptions;
  @Input() index: number;
  @Input() cardType: CARD_TYPES = CARD_TYPES.REGULAR;

  public adSlotShoppingConfiguration: AdSlotShoppingConfiguration;
  public adSlotContainer: string = AD_SHOPPING_CONTAINER_PUBLIC_SEARCH;
  public adSlotLoaded: boolean = false;

  constructor(private deviceService: DeviceService) {}

  ngOnInit() {
    this.adSlotShoppingConfiguration = {
      container: this.adSlotContainer + '-' + this.index,
      styleId: this.factoryStyleIdSlot(),
      linkTarget: '_blank',
    };
  }

  private factoryStyleIdSlot(): string {
    if (this.cardType === CARD_TYPES.WIDE) {
      return AD_SHOPPING_STYLE_ID_WIDE;
    }

    if (this.deviceService.isMobile()) {
      return AD_SHOPPING_STYLE_ID_MOBILE;
    }

    return AD_SHOPPING_STYLE_ID_DESKTOP;
  }
}
