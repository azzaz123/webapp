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
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { SubscriptionsResponse, SUBSCRIPTION_CATEGORIES } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalStatuses } from '../modal.statuses.enum';

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
    this.subscriptionsService.continueSubscription(this.subscription.selected_tier_id).subscribe(
      () => {
        this.loading = false;
        this.close();
        this.toastService.show({
          title: `${this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_CONTINUE_SUCCESS_TITLE)}`,
          text: `${this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_CONTINUE_SUCCESS_BODY)}`,
          type: 'success',
        });
      },
      () => {
        this.loading = false;
        this.close();
        this.toastService.show({
          title: `${this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_CONTINUE_ERROR_TITLE)}`,
          text: `${this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_CONTINUE_ERROR_BODY)}`,
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
