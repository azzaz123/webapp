import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';
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

  public get deliveryTime(): string {
    return `${this.deliveryMethod.deliveryTimes.from}-${this.deliveryMethod.deliveryTimes.to}`;
  }

  public get imageUrl(): string {
    return this.image?.urls_by_size.small;
  }
}
