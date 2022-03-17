import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { DELIVERY_MODE } from '@api/core/model/delivery/delivery-mode.type';
import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';
import { DeliveryCosts } from '@api/core/model/delivery/costs/delivery-costs.interface';
import { PayviewDeliveryService } from '@private/features/payview/modules/delivery/services/payview-delivery.service';

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

  constructor(private deliveryService: PayviewDeliveryService) {}

  public ngOnInit(): void {
    this.selectedPointIndex = this.defaultDeliveryMethod;
  }

  public editPoint(index: number): void {
    this.selectedPointIndex = index;
    if (this.isPickUpPoint(this.deliveryMethods[index])) {
      this.deliveryService.editPickUpPoint();
      return;
    }
    this.deliveryService.editAddress();
  }

  public isPickUpPoint(deliveryMethod: DeliveryBuyerDeliveryMethod): boolean {
    return deliveryMethod.method === DELIVERY_MODE.CARRIER_OFFICE;
  }

  public isSelected(index: number): boolean {
    return this.selectedPointIndex === index;
  }

  public selectPoint(index: number): void {
    this.selectedPointIndex = index;
    this.deliveryService.setDeliveryMethod(this.deliveryMethods[index]);
  }

  public get showDeliveryMethods(): boolean {
    return !!this.deliveryMethods && !!this.deliveryCosts;
  }

  public trackByIndex(index: number, name: DeliveryBuyerDeliveryMethod): number {
    return index;
  }
}
