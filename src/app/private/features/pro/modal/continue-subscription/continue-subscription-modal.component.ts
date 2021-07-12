import { Component } from '@angular/core';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
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
    this.subscriptionsService.continueSubscription(this.subscription.selected_tier_id).subscribe(
      () => {
        this.loading = false;
        this.close();
        this.toastService.show({
          title: `${this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_CONTINUE_SUCCESS_TITLE)}`,
          text: `${this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_CONTINUE_SUCCESS_BODY)}`,
          type: TOAST_TYPES.SUCCESS,
        });
      },
      () => {
        this.loading = false;
        this.close();
        this.toastService.show({
          title: `${this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_CONTINUE_ERROR_TITLE)}`,
          text: `${this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_CONTINUE_ERROR_BODY)}`,
          type: TOAST_TYPES.ERROR,
        });
      }
    );
  }
}
