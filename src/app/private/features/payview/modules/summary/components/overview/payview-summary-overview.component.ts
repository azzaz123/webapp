import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DeliveryBuyerDeliveryMethod, DeliveryBuyerDeliveryMethods } from '@api/core/model/delivery/buyer/delivery-methods';
import { Image } from '@core/user/user-response.interface';
import { PayviewItem } from '@private/features/payview/interfaces/payview-item.interface';

@Component({
  selector: 'tsl-payview-summary-overview',
  templateUrl: './payview-summary-overview.component.html',
  styleUrls: ['./payview-summary-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayviewSummaryOverviewComponent {
  @Input() public item: PayviewItem;
  @Input() public deliveryMethods: DeliveryBuyerDeliveryMethods;

  constructor() {}

  public get image(): Image {
    return this.item?.mainImage;
  }

  public get deliveryMethod(): DeliveryBuyerDeliveryMethod {
    return this.deliveryMethods?.current;
  }

  public get title(): string {
    return this.item?.title;
  }
}
