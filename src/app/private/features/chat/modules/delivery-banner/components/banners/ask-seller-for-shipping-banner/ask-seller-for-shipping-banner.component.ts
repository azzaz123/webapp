import { Component, OnInit } from '@angular/core';
import { BannerSpecifications } from '@shared/banner/banner-specifications.interface';
import { AbstractDeliveryBannerComponent } from '../../../classes/abstract-delivery-banner.component';

@Component({
  selector: 'tsl-ask-seller-for-shipping-banner',
  templateUrl: './ask-seller-for-shipping-banner.component.html',
  styleUrls: ['./ask-seller-for-shipping-banner.component.scss'],
})
export class AskSellerForShippingBannerComponent extends AbstractDeliveryBannerComponent {
  public readonly iconPath: string = 'assets/icons/crossed-box.svg';

  public readonly bannerStyleProperties: BannerSpecifications = {
    dismissible: false,
    type: 'info',
    isFullHeight: true,
  };
}
