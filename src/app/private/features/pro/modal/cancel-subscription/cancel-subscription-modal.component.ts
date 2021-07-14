import { Component } from '@angular/core';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { I18nService } from '@core/i18n/i18n.service';
import { SubscriptionsResponse, SUBSCRIPTION_CATEGORIES } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  SCREEN_IDS,
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickConfirmCloseSubscription,
} from '@core/analytics/analytics-constants';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ModalStatuses } from '../modal.statuses.enum';

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
    this.subscriptionsService.cancelSubscription(this.subscription.selected_tier_id).subscribe((response) => {
      if (response.status === 202) {
        this.toastService.show({
          title: `${this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_CANCEL_SUCCESS_TITLE)}`,
          text: `${this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_CANCEL_SUCCESS_BODY)}`,
          type: TOAST_TYPES.SUCCESS,
        });
        this.loading = false;
        this.activeModal.close(ModalStatuses.SUCCESS);
      } else {
        this.loading = false;
        this.toastService.show({
          title: `${this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_CANCEL_ERROR_TITLE)}`,
          text: `${this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_CANCEL_ERROR_BODY)}`,
          type: TOAST_TYPES.ERROR,
        });
        this.activeModal.close(ModalStatuses.FAIL);
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
