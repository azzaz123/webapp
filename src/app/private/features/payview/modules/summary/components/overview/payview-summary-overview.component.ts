import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CUSTOMER_HELP_PAGE } from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';
import { I18nService } from '@core/i18n/i18n.service';
import { Image } from '@core/user/user-response.interface';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DeliveryBuyerCalculatorCosts } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-costs.interface';

@Component({
  selector: 'tsl-payview-summary-overview',
  templateUrl: './payview-summary-overview.component.html',
  styleUrls: ['./payview-summary-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayviewSummaryOverviewComponent {
  @Input() public payviewState: PayviewState;

  constructor(private activeModal: NgbActiveModal, private customerHelpService: CustomerHelpService, private i18n: I18nService) {}

  public closeModal(): void {
    this.activeModal.close();
  }

  public get costs(): DeliveryBuyerCalculatorCosts {
    return this.payviewState.costs;
  }

  public get deliveryMethod(): DeliveryBuyerDeliveryMethod {
    return this.payviewState.delivery.methods.current;
  }

  public get helpUrl(): string {
    return this.customerHelpService.getPageUrl(CUSTOMER_HELP_PAGE.PAYVIEW);
  }

  public get image(): Image {
    return this.payviewState.item.mainImage;
  }

  public get showBody(): boolean {
    return !!this.payviewState.costs;
  }

  public get showHeader(): boolean {
    return !!this.payviewState.item && !!this.payviewState.delivery.methods;
  }

  public get title(): string {
    return this.payviewState.item.title;
  }

  public get wallapop(): string {
    return $localize`:@@pay_view_buyer_plain_text_inspirational_quote_wallapop_name:Wallapop`;
  }
}
