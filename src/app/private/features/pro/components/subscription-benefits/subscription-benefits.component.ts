import { Component, OnInit } from '@angular/core';
import { CUSTOMER_HELP_PAGE } from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { SubscriptionBenefit } from '@core/subscriptions/subscription-benefits/interfaces/subscription-benefit.interface';
import { SubscriptionBenefitsService } from '@core/subscriptions/subscription-benefits/services/subscription-benefits.service';
import { ICON_TYPE } from '@shared/pro-badge/pro-badge.interface';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'tsl-subscription-benefits',
  templateUrl: './subscription-benefits.component.html',
  styleUrls: ['./subscription-benefits.component.scss'],
})
export class SubscriptionBenefitsComponent implements OnInit {
  public loading = true;
  public benefits: SubscriptionBenefit[];
  public readonly ICON_TYPE = ICON_TYPE;
  public helpPageUrl: string;

  constructor(private subscriptionBenefitsService: SubscriptionBenefitsService, private customerHelpService: CustomerHelpService) {}

  ngOnInit() {
    this.helpPageUrl = this.customerHelpService.getPageUrl(CUSTOMER_HELP_PAGE.PROS_SUBSCRIPRION_INFO);
    this.subscriptionBenefitsService
      .getSubscriptionBenefits()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((response) => (this.benefits = response));
  }
}
