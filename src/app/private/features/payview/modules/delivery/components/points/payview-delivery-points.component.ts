import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DELIVERY_MODE } from '@api/core/model/delivery/delivery-mode.type';
import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';
import { DeliveryCosts } from '@api/core/model/delivery/costs/delivery-costs.interface';
import { Money } from '@api/core/model/money.interface';

@Component({
  selector: 'tsl-payview-delivery-points',
  templateUrl: './payview-delivery-points.component.html',
  styleUrls: ['./payview-delivery-points.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayviewDeliveryPointsComponent {
  @Input() public deliveryCosts: DeliveryCosts;
  @Input() public deliveryMethods: DeliveryBuyerDeliveryMethod[];

  public selectedDeliveryMethodIndex: number;

  public getDeliveryCost(deliveryMethod: DeliveryBuyerDeliveryMethod): string {
    if (this.isPickUpPoint(deliveryMethod)) {
      return this.formatMoney(this.deliveryCosts.carrierOfficeCost);
    }
    return this.formatMoney(this.deliveryCosts.buyerAddressCost);
  }

  public isPickUpPoint(deliveryMethod: DeliveryBuyerDeliveryMethod): boolean {
    return deliveryMethod.method === DELIVERY_MODE.CARRIER_OFFICE;
  }

  public selectPoint(index: number): void {
    // TODO -> Change current selection and deselect previous selection
  }

  public get showDeliveryMethods(): boolean {
    return !!this.deliveryMethods && !!this.deliveryCosts;
  }

  private formatMoney(money: Money): string {
    return !!money ? `${money.amount.toString()}${money.currency.symbol}` : '';
  }
}
