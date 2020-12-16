import { Component } from '@angular/core';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickCancelCloseSubscription,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { I18nService } from '@core/i18n/i18n.service';
import {
  SubscriptionsResponse,
  SUBSCRIPTION_CATEGORIES,
} from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { ToastService } from '@layout/toast/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalStatuses } from '../../core/modal.statuses.enum';

@Component({
  selector: 'tsl-continue-subscription-modal',
  templateUrl: './continue-subscription-modal.component.html',
  styleUrls: ['./continue-subscription-modal.component.scss'],
})
export class ContinueSubscriptionModalComponent {
  public loading = false;
  public subscription: SubscriptionsResponse;

  constructor(
    public activeModal: NgbActiveModal,
    public subscriptionsService: SubscriptionsService,
    private toastService: ToastService,
    private i18n: I18nService,
    private analyticsService: AnalyticsService
  ) {}

  public close() {
    this.activeModal.close(ModalStatuses.CONTINUE);
  }

  public continueSubscription() {
    this.loading = true;
    this.trackContinueSubscription();
    this.subscriptionsService
      .continueSubscription(this.subscription.selected_tier_id)
      .subscribe(
        () => {
          this.loading = false;
          this.close();
          this.toastService.show({
            text:
              this.i18n.getTranslations('continueSubscriptionSuccessTitle') +
              ' ' +
              this.i18n.getTranslations('continueSubscriptionSuccessBody'),
            type: 'success',
          });
        },
        () => {
          this.loading = false;
          this.close();
          this.toastService.show({
            text:
              this.i18n.getTranslations('continueSubscriptionErrorTitle') +
              ' ' +
              this.i18n.getTranslations('continueSubscriptionErrorBody'),
            type: 'error',
          });
        }
      );
  }

  private trackContinueSubscription() {
    const event: AnalyticsEvent<ClickCancelCloseSubscription> = {
      name: ANALYTICS_EVENT_NAMES.ClickCancelCloseSubscription,
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
