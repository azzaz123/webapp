import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickKeepCurrentSubscription,
  ClickProfileEditCurrentSubscription,
  ClickProfileSubscribeButton,
  SCREEN_IDS,
  ViewProfileSubscription,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import {
  SubscriptionsResponse,
  SUBSCRIPTION_CATEGORIES,
} from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { AddNewSubscriptionModalComponent } from '@features/profile/modal/add-new-subscription/add-new-subscription-modal.component';
import { CancelSubscriptionModalComponent } from '@features/profile/modal/cancel-subscription/cancel-subscription-modal.component';
import { CheckSubscriptionInAppModalComponent } from '@features/profile/modal/check-subscription-in-app-modal/check-subscription-in-app-modal.component';
import { ContinueSubscriptionModalComponent } from '@features/profile/modal/continue-subscription/continue-subscription-modal.component';
import { DiscountAvailableUnsubscribeInAppModalComponent } from '@features/profile/modal/discount-available-unsubscribe-in-app-modal/discount-available-unsubscribe-in-app-modal.component';
import { EditSubscriptionModalComponent } from '@features/profile/modal/edit-subscription/edit-subscription-modal.component';
import { ModalStatuses } from '@features/profile/core/modal.statuses.enum';
import { UnsubscribeInAppFirstModal } from '@features/profile/modal/unsubscribe-in-app-first-modal/unsubscribe-in-app-first-modal.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/core/user/user';
import { UserService } from 'app/core/user/user.service';
import { isEqual } from '@features/upload/drop-area/node_modules/lodash-es';
import { delay, finalize, repeatWhen, take, takeWhile } from 'rxjs/operators';

export type SubscriptionModal =
  | typeof CheckSubscriptionInAppModalComponent
  | typeof CancelSubscriptionModalComponent
  | typeof ContinueSubscriptionModalComponent
  | typeof EditSubscriptionModalComponent
  | typeof AddNewSubscriptionModalComponent;

@Component({
  selector: 'tsl-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionsComponent implements OnInit {
  public action: string;
  public subscriptions: SubscriptionsResponse[];
  public loading = false;
  public user: User;

  constructor(
    private modalService: NgbModal,
    private subscriptionsService: SubscriptionsService,
    private router: Router,
    private analyticsService: AnalyticsService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.subscriptionsService
      .getSubscriptions(false)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((subscriptions) => (this.subscriptions = subscriptions));

    this.trackPageView();
    this.userService.me(true).subscribe((user) => (this.user = user));
  }

  public openSubscriptionModal(subscription: SubscriptionsResponse): void {
    const modal = this.getModalTypeDependingOnSubscription(subscription);
    let modalRef: NgbModalRef = this.modalService.open(modal, {
      windowClass: 'review',
    });
    modalRef.componentInstance.subscription = subscription;
    modalRef.componentInstance.isNewSubscriber = !this.subscriptionsService.hasOneStripeSubscription(
      this.subscriptions
    );
    modalRef.result.then(
      (action: ModalStatuses) => {
        if (action) {
          this.loading = true;
          if (this.user && this.user.featured) {
            this.isSubscriptionUpdated();
          } else {
            this.isUserUpdated();
          }
        }
        modalRef = null;
      },
      () => {
        modalRef = null;
      }
    );

    this.trackOpenModalEvent(subscription, modal);
  }

  private isUserUpdated() {
    this.userService
      .me(false)
      .pipe(
        repeatWhen((completed) =>
          completed.pipe(
            delay(1000),
            takeWhile(() => this.loading)
          )
        ),
        take(30),
        finalize(() => {
          this.router.navigate(['profile/info']);
          this.loading = false;
        })
      )
      .subscribe((updatedUser) => {
        if (updatedUser.featured) {
          this.loading = false;
        }
      });
  }

  private isSubscriptionUpdated() {
    this.subscriptionsService
      .getSubscriptions(false)
      .pipe(
        repeatWhen((completed) =>
          completed.pipe(
            delay(1000),
            takeWhile(() => this.loading)
          )
        ),
        take(30),
        finalize(() => {
          this.router.navigate(['profile/subscriptions']),
            (this.loading = false);
        })
      )
      .subscribe((updatedSubscriptions) => {
        if (!isEqual(this.subscriptions, updatedSubscriptions)) {
          this.subscriptions = updatedSubscriptions;
          this.loading = false;
        }
      });
  }

  private trackPageView() {
    const pageView: AnalyticsPageView<ViewProfileSubscription> = {
      name: ANALYTICS_EVENT_NAMES.ViewProfileSubscription,
      attributes: {
        screenId: SCREEN_IDS.ProfileSubscription,
      },
    };

    this.analyticsService.trackPageView(pageView);
  }

  private trackOpenModalEvent(
    subscription: SubscriptionsResponse,
    modalType: SubscriptionModal
  ) {
    if (modalType === AddNewSubscriptionModalComponent) {
      const event: AnalyticsEvent<ClickProfileSubscribeButton> = {
        name: ANALYTICS_EVENT_NAMES.ClickProfileSubscribeButton,
        eventType: ANALYTIC_EVENT_TYPES.Other,
        attributes: {
          screenId: SCREEN_IDS.ProfileSubscription,
          subscription: subscription.category_id as SUBSCRIPTION_CATEGORIES,
          isNewSubscriber: !this.subscriptionsService.hasOneStripeSubscription(
            this.subscriptions
          ),
        },
      };

      return this.analyticsService.trackEvent(event);
    }

    if (modalType === EditSubscriptionModalComponent) {
      const event: AnalyticsEvent<ClickProfileEditCurrentSubscription> = {
        name: ANALYTICS_EVENT_NAMES.ClickProfileEditCurrentSubscription,
        eventType: ANALYTIC_EVENT_TYPES.Other,
        attributes: {
          subscription: subscription.category_id as SUBSCRIPTION_CATEGORIES,
          tier: subscription.selected_tier_id,
          screenId: SCREEN_IDS.ProfileSubscription,
        },
      };

      return this.analyticsService.trackEvent(event);
    }

    if (modalType === ContinueSubscriptionModalComponent) {
      const event: AnalyticsEvent<ClickKeepCurrentSubscription> = {
        name: ANALYTICS_EVENT_NAMES.ClickKeepCurrentSubscription,
        eventType: ANALYTIC_EVENT_TYPES.Other,
        attributes: {
          subscription: subscription.category_id as SUBSCRIPTION_CATEGORIES,
          tier: subscription.selected_tier_id,
          screenId: SCREEN_IDS.ProfileSubscription,
        },
      };

      return this.analyticsService.trackEvent(event);
    }
  }

  private getModalTypeDependingOnSubscription(
    subscription: SubscriptionsResponse
  ): SubscriptionModal {
    // User is trying to edit subscription that is from inapp and has discount
    if (
      this.subscriptionsService.isSubscriptionInApp(subscription) &&
      this.subscriptionsService.hasOneTierDiscount(subscription)
    ) {
      return DiscountAvailableUnsubscribeInAppModalComponent;
    }

    // User is trying to edit subscription that is from inapp
    if (this.subscriptionsService.isSubscriptionInApp(subscription)) {
      return CheckSubscriptionInAppModalComponent;
    }

    // Subscription is active, from Stripe, not cancelled, with only one tier and no limits
    if (
      this.subscriptionsService.isStripeSubscription(subscription) &&
      !subscription.subscribed_until &&
      subscription.tiers.length === 1 &&
      !subscription.tiers[0].limit
    ) {
      return CancelSubscriptionModalComponent;
    }

    // Subscription was previously canceled
    if (
      this.subscriptionsService.isStripeSubscription(subscription) &&
      subscription.subscribed_until
    ) {
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
    return (
      !this.subscriptionsService.isSubscriptionInApp(subscription) &&
      subscription.tiers.length !== 1
    );
  }

  public showCancel(subscription: SubscriptionsResponse): boolean {
    return (
      !this.subscriptionsService.isSubscriptionInApp(subscription) &&
      subscription.tiers.length === 1
    );
  }

  public showManageInApp(subscription: SubscriptionsResponse): boolean {
    return (
      this.subscriptionsService.isSubscriptionInApp(subscription) &&
      !this.subscriptionsService.hasOneFreeTier(subscription)
    );
  }

  public showUnsubscribeFirst(subscription: SubscriptionsResponse): boolean {
    return (
      this.subscriptionsService.isSubscriptionInApp(subscription) &&
      this.subscriptionsService.hasOneFreeTier(subscription)
    );
  }

  public hasOneFreeSubscription() {
    return this.subscriptionsService.hasOneFreeSubscription(this.subscriptions);
  }
}
