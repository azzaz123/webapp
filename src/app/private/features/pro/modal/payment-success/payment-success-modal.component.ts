import { Component, OnInit } from '@angular/core';
import { AnalyticsPageView, ANALYTICS_EVENT_NAMES, SCREEN_IDS, ViewSuccessSubscriptionPayment } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { SUBSCRIPTION_CATEGORIES } from '@core/subscriptions/subscriptions.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-payment-success-modal',
  templateUrl: './payment-success-modal.component.html',
  styleUrls: ['./payment-success-modal.component.scss'],
})
export class PaymentSuccessModalComponent implements OnInit {
  public tier: string;
  public isNewSubscriber = true;
  public isNewCard = true;
  public isInvoice = false;
  public subscriptionCategoryId: SUBSCRIPTION_CATEGORIES;

  constructor(public activeModal: NgbActiveModal, private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.trackPageView();
  }

  public close() {
    this.activeModal.close();
  }

  private trackPageView() {
    const pageView: AnalyticsPageView<ViewSuccessSubscriptionPayment> = {
      name: ANALYTICS_EVENT_NAMES.ViewSuccessSubscriptionPayment,
      attributes: {
        tier: this.tier,
        isNewSubscriber: this.isNewSubscriber,
        isNewCard: this.isNewCard,
        subscription: this.subscriptionCategoryId,
        screenId: SCREEN_IDS.ProfileSubscription,
      },
    };
    this.analyticsService.trackPageView(pageView);
  }
}
