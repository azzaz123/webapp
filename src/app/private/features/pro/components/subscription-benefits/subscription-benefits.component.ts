import { Component, OnInit } from '@angular/core';
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

  constructor(private subscriptionBenefitsService: SubscriptionBenefitsService) {}

  get faqUrl(): string {
    return $localize`:@@web_footer_links_faq_href:https://ayuda.wallapop.com/hc/en-us`;
  }

  ngOnInit() {
    this.subscriptionBenefitsService
      .getSubscriptionBenefits()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((response) => (this.benefits = response));
  }
}
