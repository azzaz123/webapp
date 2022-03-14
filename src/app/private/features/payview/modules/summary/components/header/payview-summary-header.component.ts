import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';
import { DELIVERY_MODE } from '@api/core/model/delivery/delivery-mode.type';
import { Image } from '@core/user/user-response.interface';

@Component({
  selector: 'tsl-payview-summary-header',
  templateUrl: './payview-summary-header.component.html',
  styleUrls: ['./payview-summary-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayviewSummaryHeaderComponent {
  @Input() public image: Image;
  @Input() public deliveryMethod: DeliveryBuyerDeliveryMethod;
  @Input() public title: string;

  constructor() {}

  public get address(): string {
    return this.deliveryMethod.lastAddressUsed.label;
  }

  public get deliveryTime(): string {
    return `${this.deliveryMethod.deliveryTimes.from}-${this.deliveryMethod.deliveryTimes.to}`;
  }

  public get imageUrl(): string {
    return this.image.urls_by_size.small;
  }

  public get isHome(): boolean {
    return this.deliveryMethod.method === DELIVERY_MODE.BUYER_ADDRESS;
  }

  public get isOffice(): boolean {
    return this.deliveryMethod.method === DELIVERY_MODE.CARRIER_OFFICE;
  }

  public get showAddress(): boolean {
    return !!this.deliveryMethod.lastAddressUsed;
  }

  public get showDeliveryTime(): boolean {
    return !!this.deliveryMethod.deliveryTimes;
  }
}
