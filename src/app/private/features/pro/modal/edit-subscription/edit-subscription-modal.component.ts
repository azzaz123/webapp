import { Component, OnInit } from '@angular/core';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickSubscriptionPlanDone,
  SCREEN_IDS,
  ViewEditSubscriptionPlan,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { I18nService } from '@core/i18n/i18n.service';
import { SubscriptionsResponse, SUBSCRIPTION_CATEGORIES, Tier } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CancelSubscriptionModalComponent } from '../cancel-subscription/cancel-subscription-modal.component';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { ModalStatuses } from '../modal.statuses.enum';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';

@Component({
  selector: 'tsl-edit-subscription-modal',
  templateUrl: './edit-subscription-modal.component.html',
  styleUrls: ['./edit-subscription-modal.component.scss'],
})
export class EditSubscriptionModalComponent implements OnInit {
  public isLast: boolean;
  public card: any;
  public action: string;
  public showCard = false;
  public savedCard = true;
  public selectedCard = false;
  public selectedTier: Tier;
  public currentTier: Tier;
  public loading = false;
  public isPaymentError = false;
  public isRetryInvoice = false;
  public subscription: SubscriptionsResponse;

  constructor(
    public activeModal: NgbActiveModal,
    public subscriptionsService: SubscriptionsService,
    private toastService: ToastService,
    private i18n: I18nService,
    private modalService: NgbModal,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.selectedTier = this.subscription.selected_tier;
    this.currentTier = this.selectedTier;

    const pageView: AnalyticsPageView<ViewEditSubscriptionPlan> = {
      name: ANALYTICS_EVENT_NAMES.ViewEditSubscriptionPlan,
      attributes: {
        screenId: SCREEN_IDS.SubscriptionManagement,
      },
    };

    this.analyticsService.trackPageView(pageView);
  }

  public close(status: ModalStatuses) {
    this.activeModal.close(status);
  }

  public editSubscription() {
    this.trackClickConfirmEdit();
    this.loading = true;
    this.subscriptionsService.editSubscription(this.subscription, this.selectedTier.id).subscribe((response) => {
      if (response.status === 202) {
        this.toastService.show({
          title: `${this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_EDIT_SUCCESS_TITLE)}`,
          text: `${this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_EDIT_SUCCESS_BODY)}`,
          type: TOAST_TYPES.SUCCESS,
        });
        this.loading = false;
      } else {
        this.loading = false;
        this.toastService.show({
          title: `${this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_EDIT_SUCCESS_TITLE)}`,
          text: `${this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_EDIT_SUCCESS_BODY)}`,
          type: TOAST_TYPES.ERROR,
        });
      }
      this.close(ModalStatuses.UPDATE);
    });
  }

  public selectListingLimit(tier: Tier): void {
    this.selectedTier = tier;
  }

  public isCurrentTier(): boolean {
    return this.selectedTier && this.currentTier ? this.currentTier === this.selectedTier : false;
  }

  public cancelSubscription() {
    const modal = CancelSubscriptionModalComponent;
    let modalRef: NgbModalRef = this.modalService.open(modal, {
      windowClass: 'review',
    });
    modalRef.componentInstance.subscription = this.subscription;
    modalRef.result.then(
      (result: ModalStatuses) => {
        this.close(result);
        modalRef = null;
      },
      () => {}
    );
  }

  public hasTrial(subscription: SubscriptionsResponse): boolean {
    return this.subscriptionsService.hasTrial(subscription);
  }

  private trackClickConfirmEdit() {
    const event: AnalyticsEvent<ClickSubscriptionPlanDone> = {
      name: ANALYTICS_EVENT_NAMES.ClickSubscriptionPlanDone,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        subscription: this.subscription.category_id as SUBSCRIPTION_CATEGORIES,
        previousTier: this.currentTier.id,
        newTier: this.selectedTier.id,
        screenId: SCREEN_IDS.SubscriptionManagement,
      },
    };
    this.analyticsService.trackEvent(event);
  }
}
