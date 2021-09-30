import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { AD_SHOPPING_STYLE_ID_DESKTOP, AD_SHOPPING_STYLE_ID_MOBILE, AD_SHOPPING_STYLE_ID_WIDE } from '@core/ads/constants';
import { AdShoppingPageOptions, AdSlotShoppingConfiguration } from '@core/ads/models';
import { AdsService } from '@core/ads/services';
import { DeviceService } from '@core/device/device.service';
import { CARD_TYPES } from '@public/shared/components/item-card-list/enums/card-types.enum';

@Component({
  selector: 'tsl-sky-shopping',
  templateUrl: 'ad-slot-shopping.component.html',
  styleUrls: ['./ad-slot-shopping.component.scss'],
})
export class AdSlotShoppingComponent implements OnInit, AfterViewInit {
  @Input() adShoppingPageOptions: AdShoppingPageOptions;
  @Input() adSlotContainer: string;
  @Input() index: number;
  @Input() cardType: CARD_TYPES = CARD_TYPES.REGULAR;

  public adSlotShoppingConfiguration: AdSlotShoppingConfiguration;

  constructor(private adsService: AdsService, private deviceService: DeviceService) {}

  ngOnInit() {
    this.adSlotShoppingConfiguration = {
      container: this.adSlotContainer + '-' + this.index,
      styleId: this.factoryStyleIdSlot(),
      linkTarget: '_blank',
    };
  }

  ngAfterViewInit(): void {
    // this.adsService.displayAdShopping(this.adShoppingPageOptions, this.adSlotShoppingConfiguration);
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
