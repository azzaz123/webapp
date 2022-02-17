import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';
import { DeliveryCosts } from '@api/core/model/delivery/costs/delivery-costs.interface';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';

@Component({
  selector: 'tsl-payview-delivery-overview',
  templateUrl: './payview-delivery-overview.component.html',
  styleUrls: ['./payview-delivery-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayviewDeliveryOverviewComponent {
  @Input() public payviewState: PayviewState;

  public get deliveryCosts(): DeliveryCosts {
    return this.payviewState.delivery.costs;
  }

  public get deliveryMethods(): DeliveryBuyerDeliveryMethod[] {
    return this.payviewState.delivery.methods.deliveryMethods;
  }

  public get showDelivery(): boolean {
    return !!this.payviewState.delivery;
  }

  public get showDeliveryPoints(): boolean {
    return !!this.payviewState.delivery.methods.deliveryMethods && this.payviewState.delivery.methods.deliveryMethods.length > 0;
  }
}
