import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { AD_SHOPPING_STYLE_ID_DESKTOP, AD_SHOPPING_STYLE_ID_MOBILE, AD_SHOPPING_STYLE_ID_WIDE } from '@core/ads/constants';
import { AdShoppingPageOptions, AdSlotShoppingConfiguration } from '@core/ads/models';
import { AdsService } from '@core/ads/services';
import { DeviceService } from '@core/device/device.service';

@Component({
  selector: 'tsl-sky-shopping',
  templateUrl: 'ad-slot-shopping.component.html',
  styleUrls: ['./ad-slot-shopping.component.scss'],
})
export class AdSlotShoppingComponent implements OnInit, AfterViewInit {
  @Input() adShoppingPageOptions: AdShoppingPageOptions;
  @Input() adSlotContainer: string;
  @Input() index: number;
  @Input() isWide = false;

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
    this.adsService.displayAdShopping(this.adShoppingPageOptions, this.adSlotShoppingConfiguration);
  }

  private factoryStyleIdSlot(): string {
    if (this.isWide) {
      return AD_SHOPPING_STYLE_ID_WIDE;
    }

    if (this.deviceService.isMobile()) {
      return AD_SHOPPING_STYLE_ID_MOBILE;
    }

    return AD_SHOPPING_STYLE_ID_DESKTOP;
  }
}
