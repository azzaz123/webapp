import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DELIVERY_MODE } from '@api/core/model/delivery/delivery-mode.type';
import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';
import { DeliveryCosts } from '@api/core/model/delivery/costs/delivery-costs.interface';
import { Money } from '@api/core/model/money.interface';

@Component({
  selector: 'tsl-payview-delivery-point',
  templateUrl: './payview-delivery-point.component.html',
  styleUrls: ['./payview-delivery-point.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayviewDeliveryPointComponent {
  @Input() public deliveryCosts: DeliveryCosts;
  @Input() public deliveryMethod: DeliveryBuyerDeliveryMethod;

  public selectedDeliveryMethodIndex: number;

  public get actionTitle(): string {
    if (this.isOffice && !this.showAddress) {
      return $localize`:@@pay_view_buyer_delivery_method_po_selector_select_button:View pick-up points`;
    }
    if (this.isOffice && this.showAddress) {
      return $localize`:@@pay_view_buyer_delivery_method_po_selector_edit_button:Edit pick-up point`;
    }
    if (this.isHome && !this.showAddress) {
      return $localize`:@@pay_view_buyer_delivery_method_ba_selector_select_button:Add address`;
    }
    return $localize`:@@pay_view_buyer_delivery_method_ba_selector_edit_button:Edit address`;
  }

  public get address(): string {
    return this.deliveryMethod.lastAddressUsed?.label;
  }

  public get deliveryCost(): string {
    if (this.isOffice) {
      return this.toString(this.deliveryCosts.carrierOfficeCost);
    }
    return this.toString(this.deliveryCosts.buyerAddressCost);
  }

  public get deliveryTime(): string {
    return `${this.deliveryMethod.deliveryTimes.from}-${this.deliveryMethod.deliveryTimes.to}`;
  }

  public get isHome(): boolean {
    return this.deliveryMethod.method === DELIVERY_MODE.BUYER_ADDRESS;
  }

  public get isOffice(): boolean {
    return this.deliveryMethod.method === DELIVERY_MODE.CARRIER_OFFICE;
  }

  public get isSelected(): boolean {
    return this.selectedDeliveryMethodIndex === 0;
  }

  public selectPoint(index: number): void {
    // TODO -> Change current selection and deselect previous selection
    this.selectedDeliveryMethodIndex = index;
  }

  public get showAddress(): boolean {
    return !!this.deliveryMethod.lastAddressUsed;
  }

  public get showInformation(): boolean {
    return this.isSelected;
  }

  private toString(money: Money): string {
    return !!money ? `${money.amount.toString()}${money.currency.symbol}` : '';
  }
}
