import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

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
export class PayviewDeliveryPointsComponent implements OnInit {
  @Input() public defaultDeliveryMethod: number;
  @Input() public deliveryCosts: DeliveryCosts;
  @Input() public deliveryMethods: DeliveryBuyerDeliveryMethod[];

  private selectedPointIndex: number;

  public ngOnInit(): void {
    this.selectedPointIndex = this.defaultDeliveryMethod;
  }

  public getDeliveryCost(deliveryMethod: DeliveryBuyerDeliveryMethod): string {
    if (this.isPickUpPoint(deliveryMethod)) {
      return this.toString(this.deliveryCosts.carrierOfficeCost);
    }
    return this.toString(this.deliveryCosts.buyerAddressCost);
  }

  public getDeliveryTime(deliveryMethod: DeliveryBuyerDeliveryMethod): string {
    return `${deliveryMethod.deliveryTimes.from}-${deliveryMethod.deliveryTimes.to}`;
  }

  public isPickUpPoint(deliveryMethod: DeliveryBuyerDeliveryMethod): boolean {
    return deliveryMethod.method === DELIVERY_MODE.CARRIER_OFFICE;
  }

  public isSelected(index: number): boolean {
    return this.selectedPointIndex === index;
  }

  public selectPoint(index: number): void {
    this.selectedPointIndex = index;
  }

  public get showDeliveryMethods(): boolean {
    return !!this.deliveryMethods && !!this.deliveryCosts;
  }

  public trackByIndex(index: number, name: DeliveryBuyerDeliveryMethod): number {
    return index;
  }

  private toString(money: Money): string {
    return !!money ? `${money.amount.toString()}${money.currency.symbol}` : '';
  }
}
