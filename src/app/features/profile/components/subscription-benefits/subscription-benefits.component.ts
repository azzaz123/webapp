import { Component, OnInit } from '@angular/core';
import { SubscriptionBenefit } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'tsl-subscription-benefits',
  templateUrl: './subscription-benefits.component.html',
  styleUrls: ['./subscription-benefits.component.scss'],
})
export class SubscriptionBenefitsComponent implements OnInit {
  public loading = true;
  public benefits: SubscriptionBenefit[];
  public faqsUrl: string;

  constructor(private subscriptionService: SubscriptionsService) {}

  get faqUrl(): string {
    return $localize`:@@FooterLinksFaqHref:https://ayuda.wallapop.com/hc/en-us`;
  }

  ngOnInit() {
    this.subscriptionService
      .getSubscriptionBenefits()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((response) => (this.benefits = response));
  }
}
