import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionsResponse } from '../../../core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '../../../core/subscriptions/subscriptions.service';
import { ToastrService } from 'ngx-toastr';
import { I18nService } from '../../../core/i18n/i18n.service';
import { AnalyticsService } from '../../../core/analytics/analytics.service';
import { AnalyticsEvent, ClickUnsuscribeConfirmation, ANALYTICS_EVENT_NAMES, ANALYTIC_EVENT_TYPES } from '../../../core/analytics/analytics-constants';

@Component({
  selector: 'tsl-cancel-subscription-modal',
  templateUrl: './cancel-subscription-modal.component.html',
  styleUrls: ['./cancel-subscription-modal.component.scss']
})

export class CancelSubscriptionModalComponent {

  public loading = false;
  public subscription: SubscriptionsResponse;

  constructor(public activeModal: NgbActiveModal,
              public subscriptionsService: SubscriptionsService,
              private toastr: ToastrService,
              private i18n: I18nService,
              private analyticsService: AnalyticsService) {
  }

  public cancelSubscription() {
    this.loading = true;
    this.trackCancelSubscription();
    this.subscriptionsService.cancelSubscription(this.subscription.selected_tier_id).subscribe((response) => {
      if (response.status === 202) {
          this.toastr.success(this.i18n.getTranslations('cancelSubscriptionSuccessTitle') + ' ' + this.i18n.getTranslations('cancelSubscriptionSuccessBody'));
          this.loading = false;
          this.activeModal.close('success');
      } else {
        this.loading = false;
        this.toastr.error(this.i18n.getTranslations('cancelSubscriptionErrorTitle') + ' ' + this.i18n.getTranslations('cancelSubscriptionErrorBody'));
        this.activeModal.close('fail');
      }
    });
  }

  private trackCancelSubscription() {
    const event: AnalyticsEvent<ClickUnsuscribeConfirmation> = {
      name: ANALYTICS_EVENT_NAMES.ClickUnsuscribeConfirmation,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        screenId: 205
      }
    };
    
    this.analyticsService.trackEvent(event);
  }
}
