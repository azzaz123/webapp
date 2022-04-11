import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DeliveryBuyerDeliveryMethod, DeliveryBuyerDeliveryMethods } from '@api/core/model/delivery/buyer/delivery-methods';
import { DeliveryCosts } from '@api/core/model/delivery/costs/delivery-costs.interface';

@Component({
  selector: 'tsl-payview-delivery-overview',
  templateUrl: './payview-delivery-overview.component.html',
  styleUrls: ['./payview-delivery-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayviewDeliveryOverviewComponent {
  @Input() public costs: DeliveryCosts;
  @Input() public methods: DeliveryBuyerDeliveryMethods;

  public get defaultDeliveryMethod(): number {
    return this.methods.default.index;
  }

  public get deliveryMethods(): DeliveryBuyerDeliveryMethod[] {
    return this.methods.deliveryMethods;
  }

  public get showDelivery(): boolean {
    return !!this.costs && !!this.methods;
  }

  public get showDeliveryPoints(): boolean {
    return !!this.methods.deliveryMethods && this.methods.deliveryMethods.length > 0;
  }
}
