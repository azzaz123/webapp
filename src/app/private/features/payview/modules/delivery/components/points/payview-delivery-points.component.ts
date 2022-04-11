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
  @Input() public costs: DeliveryCosts;
  @Input() public defaultMethod: number;
  @Input() public methods: DeliveryBuyerDeliveryMethod[];

  private selectedPointIndex: number;

  constructor(private deliveryService: PayviewDeliveryService) {}

  public ngOnInit(): void {
    this.selectedPointIndex = this.defaultMethod;
  }

  public editPoint(index: number): void {
    this.selectedPointIndex = index;
    if (this.isPickUpPoint(this.methods[index])) {
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
    this.deliveryService.setDeliveryMethod(this.methods[index]);
  }

  public get showMethods(): boolean {
    return !!this.methods && !!this.costs;
  }

  public trackByIndex(index: number, name: DeliveryBuyerDeliveryMethod): number {
    return index;
  }
}
