import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { DELIVERY_MODE } from '@api/core/model/delivery/delivery-mode.type';
import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';
import { DeliveryCosts } from '@api/core/model/delivery/costs/delivery-costs.interface';
import { Money } from '@api/core/model/money.interface';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

@Component({
  selector: 'tsl-payview-delivery-point',
  templateUrl: './payview-delivery-point.component.html',
  styleUrls: ['./payview-delivery-point.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('enterAnimation', [
      state('*', style({ 'overflow-y': 'hidden' })),
      state('void', style({ 'overflow-y': 'hidden' })),
      transition('* => void', [style({ height: '*' }), animate('100ms 50ms', style({ height: 0 }))]),
      transition('void => *', [style({ height: '0' }), animate(100, style({ height: '*' }))]),
    ]),
  ],
})
export class PayviewDeliveryPointComponent {
  @Input() public deliveryCosts: DeliveryCosts;
  @Input() public deliveryMethod: DeliveryBuyerDeliveryMethod;
  @Input() public id: number;
  @Input() public isChecked: boolean;
  @Output() public checked: EventEmitter<number> = new EventEmitter<number>();

  constructor(private i18nService: I18nService) {}

  public get actionTitle(): string {
    if (this.isOffice && !this.showAddress) {
      return this.i18nService.translate(TRANSLATION_KEY.PAYVIEW_DELIVERY_VIEW_PICK_UP_POINT);
    }
    if (this.isOffice && this.showAddress) {
      return this.i18nService.translate(TRANSLATION_KEY.PAYVIEW_DELIVERY_EDIT_PICK_UP_POINT);
    }
    if (this.isHome && !this.showAddress) {
      return this.i18nService.translate(TRANSLATION_KEY.PAYVIEW_DELIVERY_ADD_ADDRESS);
    }
    return this.i18nService.translate(TRANSLATION_KEY.PAYVIEW_DELIVERY_EDIT_ADDRESS);
  }

  public get address(): string {
    return this.deliveryMethod.lastAddressUsed?.label;
  }

  public get deliveryCost(): string {
    if (this.isOffice) {
      return this.formatMoney(this.deliveryCosts.carrierOfficeCost);
    }
    return this.formatMoney(this.deliveryCosts.buyerAddressCost);
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

  public selectPoint(index: number): void {
    this.checked.emit(this.id);
  }

  public get showAddress(): boolean {
    return !!this.deliveryMethod.lastAddressUsed;
  }

  private formatMoney(money: Money): string {
    return !!money ? `${money.amount.toString()}${money.currency.symbol}` : '';
  }
}
