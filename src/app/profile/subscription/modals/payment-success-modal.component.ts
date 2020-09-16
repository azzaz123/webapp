import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AnalyticsService } from '../../../core/analytics/analytics.service';
import {
  AnalyticsPageView,
  ViewSuccessSubscriptionPayment,
  ANALYTICS_EVENT_NAMES,
  SCREEN_IDS
} from '../../../core/analytics/analytics-constants';
import { SUBSCRIPTION_CATEGORIES } from '../../../core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-payment-success-modal',
  templateUrl: './payment-success-modal.component.html',
  styleUrls: ['./payment-success-modal.component.scss']
})

export class PaymentSuccessModalComponent implements OnInit {

  public tier: string;
  public isNewSubscriber = true;
  public isNewCard = true;
  public isInvoice = 'false';
  public subscriptionCategoryId: SUBSCRIPTION_CATEGORIES;

  constructor(public activeModal: NgbActiveModal, private analyticsService: AnalyticsService) {
  }

  ngOnInit() {
    this.trackPageView();
  }

  private trackPageView() {
    const pageView: AnalyticsPageView<ViewSuccessSubscriptionPayment> = {
      name: ANALYTICS_EVENT_NAMES.ViewSuccessSubscriptionPayment,
      attributes: {
        tier: this.tier,
        isNewSubscriber: this.isNewSubscriber,
        isNewCard: this.isNewCard,
        subscription: this.subscriptionCategoryId,
        screenId: SCREEN_IDS.ProfileSubscription
      }
    };
    this.analyticsService.trackPageView(pageView);
  }

  public close() {
      this.activeModal.close();
  }

}
