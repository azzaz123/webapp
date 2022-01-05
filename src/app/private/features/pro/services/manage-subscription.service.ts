import { Injectable } from '@angular/core';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickConfirmCloseSubscription,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { SubscriptionsResponse, SUBSCRIPTION_CATEGORIES } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProModalComponent } from '@shared/modals/pro-modal/pro-modal.component';
import { modalConfig, PRO_MODAL_TYPE } from '@shared/modals/pro-modal/pro-modal.constants';
import { MODAL_ACTION } from '@shared/modals/pro-modal/pro-modal.interface';
import { Observable, Subscriber } from 'rxjs';

export const STRIPE_SUCCESSFUL_CODE = 202;

@Injectable()
export class ManageSubscriptionService {
  constructor(
    private modalService: NgbModal,
    private subscriptionsService: SubscriptionsService,
    private analyticsService: AnalyticsService,
    private toastService: ToastService
  ) {}

  public cancelSubscription(subscription: SubscriptionsResponse): Observable<boolean> {
    return new Observable((observer: Subscriber<boolean>) => {
      this.openCancelSubscriptionModal(observer, subscription);
    });
  }

  public continueSubscription(subscription: SubscriptionsResponse): Observable<boolean> {
    return new Observable((observer: Subscriber<boolean>) => {
      this.openContinueSubscriptionModal(observer, subscription);
    });
  }

  private openContinueSubscriptionModal(observer: Subscriber<boolean>, subscription: SubscriptionsResponse) {
    const modalRef: NgbModalRef = this.modalService.open(ProModalComponent, {
      windowClass: 'pro-modal',
    });

    modalRef.componentInstance.modalConfig = modalConfig[PRO_MODAL_TYPE.continue_subscription];
    modalRef.componentInstance.modalConfig.title = $localize`:@@web_continue_subscription_title:Would you like to stay subscribed to Wallapop PRO ${subscription.category_name}:INTERPOLATION:?`;
    modalRef.result.then((result: MODAL_ACTION) => {
      if (result === MODAL_ACTION.PRIMARY_BUTTON) {
        this.confirmContinueSubscription(observer, subscription);
        return;
      }
      observer.error();
    });
  }

  private openCancelSubscriptionModal(observer: Subscriber<boolean>, subscription: SubscriptionsResponse) {
    const modalRef: NgbModalRef = this.modalService.open(ProModalComponent, {
      windowClass: 'pro-modal',
    });

    modalRef.componentInstance.modalConfig = modalConfig[PRO_MODAL_TYPE.cancel_subscription];
    modalRef.result.then((result: MODAL_ACTION) => {
      if (result === MODAL_ACTION.PRIMARY_BUTTON) {
        this.confirmCancelSubscription(observer, subscription);
        return;
      }
      observer.error();
    });
  }

  private confirmContinueSubscription(observer: Subscriber<boolean>, subscription): void {
    observer.next(true);
    this.subscriptionsService.continueSubscription(subscription.selected_tier_id).subscribe(
      (response) => {
        if (response.status === STRIPE_SUCCESSFUL_CODE) {
          this.toastService.show({
            title: $localize`:@@web_pro_subscription_continue_success_title:Success`,
            text: $localize`:@@web_pro_subscription_continue_success_body:Your subscription is active again`,
            type: TOAST_TYPES.SUCCESS,
          });
          observer.complete();
        } else {
          observer.error();
          this.toastService.show({
            title: $localize`:@@web_pro_subscription_continue_error_title:There was an error`,
            text: $localize`:@@web_pro_subscription_continue_error_body:We could not proceed with your request.`,
            type: TOAST_TYPES.ERROR,
          });
        }
      },
      () => {
        observer.error();
        this.toastService.show({
          title: $localize`:@@web_pro_subscription_continue_error_title:There was an error`,
          text: $localize`:@@web_pro_subscription_continue_error_body:We could not proceed with your request.`,
          type: TOAST_TYPES.ERROR,
        });
      }
    );
  }

  private confirmCancelSubscription(observer: Subscriber<boolean>, subscription): void {
    observer.next(true);
    this.trackClickConfirmCloseSubscription(subscription);
    this.subscriptionsService.cancelSubscription(subscription.selected_tier_id).subscribe(
      (response) => {
        if (response.status === STRIPE_SUCCESSFUL_CODE) {
          this.toastService.show({
            title: $localize`:@@web_pro_subscription_cancel_success_title:Subscription cancelled.`,
            text: $localize`:@@web_pro_subscription_cancel_success_body:We are sad to see you go.`,
            type: TOAST_TYPES.SUCCESS,
          });
          observer.complete();
        } else {
          observer.error();
          this.toastService.show({
            title: $localize`:@@web_pro_subscription_cancel_error_title:There was an error`,
            text: $localize`:@@web_pro_subscription_cancel_error_body:Your subscription could not be cancelled.`,
            type: TOAST_TYPES.ERROR,
          });
        }
      },
      () => {
        observer.error();
        this.toastService.show({
          title: $localize`:@@web_pro_subscription_cancel_error_title:There was an error`,
          text: $localize`:@@web_pro_subscription_cancel_error_body:Your subscription could not be cancelled.`,
          type: TOAST_TYPES.ERROR,
        });
      }
    );
  }

  private trackClickConfirmCloseSubscription(subscription) {
    const event: AnalyticsEvent<ClickConfirmCloseSubscription> = {
      name: ANALYTICS_EVENT_NAMES.ClickConfirmCloseSubscription,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        subscription: subscription.category_id as SUBSCRIPTION_CATEGORIES,
        tier: subscription.selected_tier_id,
        screenId: SCREEN_IDS.ProfileSubscription,
      },
    };

    this.analyticsService.trackEvent(event);
  }
}
