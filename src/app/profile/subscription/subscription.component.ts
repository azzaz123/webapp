import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddNewSubscriptionModalComponent } from './modals/add-new-subscription-modal.component';
import { SubscriptionsResponse } from '../../core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '../../core/subscriptions/subscriptions.service';
import { isEqual } from 'lodash-es';
import { Router } from '@angular/router';
import { finalize, repeatWhen, take, takeWhile, delay } from 'rxjs/operators';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import {
  SCREEN_IDS,
  ANALYTIC_EVENT_TYPES,
  ANALYTICS_EVENT_NAMES,
  AnalyticsEvent,
  ViewProfileSubscription,
  AnalyticsPageView,
  ClickProfileSubscribeButton,
  ClickProfileUnsuscribe,
  ClickUnsuscribeCancelation
} from '../../core/analytics/analytics-constants';
import { ContinueSubscriptionModalComponent } from './modals/continue-subscription-modal.component';
import { EditSubscriptionModalComponent } from './modals/edit-subscription-modal.component';
import { CancelSubscriptionModalComponent } from './modals/cancel-subscription-modal.component';
import { CheckSubscriptionInAppModalComponent } from './modals/check-subscription-in-app-modal/check-subscription-in-app-modal.component';
import { UnsubscribeInAppFirstModal } from './modals/unsubscribe-in-app-first-modal/unsubscribe-in-app-first-modal.component';
import { DiscountAvailableUnsubscribeInAppModalComponent } from './modals/discount-available-unsubscribe-in-app-modal/discount-available-unsubscribe-in-app-modal.component';

@Component({
  selector: 'tsl-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionsComponent implements OnInit {
  public action: string;
  public subscriptions: SubscriptionsResponse[];
  public loading = false;

  constructor(private modalService: NgbModal,
    private subscriptionsService: SubscriptionsService,
    private router: Router,
    private analyticsService: AnalyticsService) {
  }

  ngOnInit() {
    this.loading = true;
    this.subscriptionsService.getSubscriptions(false)
      .pipe(finalize(() => this.loading = false))
      .subscribe(subscriptions => this.subscriptions = subscriptions);

    this.trackPageView();
  }

  public openSubscriptionModal(subscription: SubscriptionsResponse): void {
    const modal = this.getModalTypeDependingOnSubscription(subscription);
    let modalRef: NgbModalRef = this.modalService.open(modal, { windowClass: 'review' });
    modalRef.componentInstance.subscription = subscription;
    modalRef.result.then((action: string) => {
      if (action) {
        this.loading = true;
        this.isSubscriptionUpdated();
      }
      modalRef = null;
    }, () => {
      this.trackCloseModalEvent();
      modalRef = null;
    });

    this.trackOpenModalEvent(subscription);
  }

  private isSubscriptionUpdated() {
    this.subscriptionsService.getSubscriptions(false)
      .pipe(
        repeatWhen(completed => completed.pipe(delay(1000), takeWhile(() => this.loading))),
        take(5),
        finalize(() => this.router.navigate(['profile/info']))
      )
      .subscribe(
        (updatedSubscriptions) => {
          if (!isEqual(this.subscriptions, updatedSubscriptions)) {
            this.loading = false;
          }
        });
  }

  private trackPageView() {
    const pageView: AnalyticsPageView<ViewProfileSubscription> = {
      name: ANALYTICS_EVENT_NAMES.ViewProfileSubscription,
      attributes: {
        screenId: SCREEN_IDS.ProfileSubscription
      }
    };

    this.analyticsService.trackPageView(pageView);
  }

  private trackOpenModalEvent(subscription: SubscriptionsResponse) {
    if (subscription.subscribed_until) {
      // TODO: Add tracking for Continue subscription
    } else {
      if (subscription.subscribed_from) {
        const event: AnalyticsEvent<ClickProfileUnsuscribe> = {
          name: ANALYTICS_EVENT_NAMES.ClickProfileUnsuscribe,
          eventType: ANALYTIC_EVENT_TYPES.Other,
          attributes: {
            screenId: SCREEN_IDS.ProfileSubscription,
            subscription: subscription.category_id as any
          }
        };

        this.analyticsService.trackEvent(event);
      } else {
        const isNewSubscriber =
          this.subscriptions.filter(s => s.category_id !== subscription.category_id && s.subscribed_from).length === 0;

        const event: AnalyticsEvent<ClickProfileSubscribeButton> = {
          name: ANALYTICS_EVENT_NAMES.ClickProfileSubscribeButton,
          eventType: ANALYTIC_EVENT_TYPES.Other,
          attributes: {
            screenId: SCREEN_IDS.ProfileSubscription,
            subscription: subscription.category_id as any,
            isNewSubscriber
          }
        };

        this.analyticsService.trackEvent(event);
      }
    }
  }

  private trackCloseModalEvent() {
    // TODO: This event type needs to be changed
    const event: AnalyticsEvent<ClickUnsuscribeCancelation> = {
      name: ANALYTICS_EVENT_NAMES.ClickUnsuscribeCancelation,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        screenId: SCREEN_IDS.ProfileSubscription
      }
    };
    this.analyticsService.trackEvent(event);
  }

  private getModalTypeDependingOnSubscription(subscription: SubscriptionsResponse) {
    // User is trying to edit subscription that is from inapp and has discount
    if (this.subscriptionsService.isSubscriptionInApp(subscription) && this.subscriptionsService.hasOneTierDiscount(subscription)) {
      return DiscountAvailableUnsubscribeInAppModalComponent;
    }

    // User is trying to edit subscription that is from inapp
    if (this.subscriptionsService.isSubscriptionInApp(subscription)) {
      return CheckSubscriptionInAppModalComponent;
    }
    
    // Subscription is active, from Stripe, not cancelled, with only one tier and no limits
    if (this.subscriptionsService.isStripeSubscription(subscription) && !subscription.subscribed_until && subscription.tiers.length === 1 && !subscription.tiers[0].limit) {
      return CancelSubscriptionModalComponent;
    }

    // Subscription was previously canceled
    if (this.subscriptionsService.isStripeSubscription(subscription) && subscription.subscribed_until) {
      return ContinueSubscriptionModalComponent;
    }
    
    // Subscription is active
    if (this.subscriptionsService.isStripeSubscription(subscription)) {
      return EditSubscriptionModalComponent;
    }
    
    // User is trying to subscribe but there is an active inapp subscription
    if (this.subscriptionsService.isOneSubscriptionInApp(this.subscriptions)) {
      return UnsubscribeInAppFirstModal;
    }

    // Subscription is inactive
    return AddNewSubscriptionModalComponent;
  }

  public showEdit(subscription: SubscriptionsResponse): boolean {
    return !this.subscriptionsService.isSubscriptionInApp(subscription) && subscription.tiers.length !== 1;
  }

  public showCancel(subscription: SubscriptionsResponse): boolean {
    return !this.subscriptionsService.isSubscriptionInApp(subscription) && subscription.tiers.length === 1;
  }

  public showManageInApp(subscription: SubscriptionsResponse): boolean {
    return this.subscriptionsService.isSubscriptionInApp(subscription) && !this.subscriptionsService.hasOneFreeTier(subscription);
  }

  public showUnsubscribeFirst(subscription: SubscriptionsResponse): boolean {
    return this.subscriptionsService.isSubscriptionInApp(subscription) && this.subscriptionsService.hasOneFreeTier(subscription);
  }

  public hasOneTierDiscount(subscription: SubscriptionsResponse) {
    return this.subscriptionsService.hasOneTierDiscount(subscription);
  }

  public hasOneFreeSubscription() {
    return this.subscriptionsService.hasOneFreeSubscription(this.subscriptions);
  }

  public hasOneFreeTier(subscription: SubscriptionsResponse): boolean {
    return this.subscriptionsService.hasOneFreeTier(subscription);
  }
}
