import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  SubscriptionsResponse,
  SUBSCRIPTION_CATEGORIES,
} from '../../../core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '../../../core/subscriptions/subscriptions.service';
import { ToastService } from '../../../layout/toast/toast.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { AnalyticsService } from '../../../core/analytics/analytics.service';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  SCREEN_IDS,
  ClickConfirmCloseSubscription,
} from '../../../core/analytics/analytics-constants';

@Component({
  selector: 'tsl-cancel-subscription-modal',
  templateUrl: './cancel-subscription-modal.component.html',
  styleUrls: ['./cancel-subscription-modal.component.scss'],
})
export class CancelSubscriptionModalComponent {
  public loading = false;
  public subscription: SubscriptionsResponse;

  constructor(
    public activeModal: NgbActiveModal,
    public subscriptionsService: SubscriptionsService,
    private toastService: ToastService,
    private i18n: I18nService,
    private analyticsService: AnalyticsService
  ) {}

  public cancelSubscription() {
    this.loading = true;
    this.trackCancelSubscription();
    this.subscriptionsService
      .cancelSubscription(this.subscription.selected_tier_id)
      .subscribe((response) => {
        if (response.status === 202) {
          this.toastService.show({
            text:
              this.i18n.getTranslations('cancelSubscriptionSuccessTitle') +
              ' ' +
              this.i18n.getTranslations('cancelSubscriptionSuccessBody'),
            type: 'success',
          });
          this.loading = false;
          this.activeModal.close('success');
        } else {
          this.loading = false;
          this.toastService.show({
            text:
              this.i18n.getTranslations('cancelSubscriptionErrorTitle') +
              ' ' +
              this.i18n.getTranslations('cancelSubscriptionErrorBody'),
            type: 'error',
          });
          this.activeModal.close('fail');
        }
      });
  }

  private trackCancelSubscription() {
    const event: AnalyticsEvent<ClickConfirmCloseSubscription> = {
      name: ANALYTICS_EVENT_NAMES.ClickConfirmCloseSubscription,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        subscription: this.subscription.category_id as SUBSCRIPTION_CATEGORIES,
        tier: this.subscription.selected_tier_id,
        screenId: SCREEN_IDS.ProfileSubscription,
      },
    };

    this.analyticsService.trackEvent(event);
  }
}
