import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickKeepCurrentSubscription,
  ClickProfileEditCurrentSubscription,
  ClickProSubscription,
  ClickSubscriptionManagementPlus,
  SCREEN_IDS,
  ViewSubscription,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { SubscriptionsResponse, SUBSCRIPTION_CATEGORIES, SUBSCRIPTION_SOURCE } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { AddNewSubscriptionModalComponent } from '@private/features/profile/modal/add-new-subscription/add-new-subscription-modal.component';
import { CancelSubscriptionModalComponent } from '@private/features/profile/modal/cancel-subscription/cancel-subscription-modal.component';
import { CheckSubscriptionInAppModalComponent } from '@private/features/profile/modal/check-subscription-in-app-modal/check-subscription-in-app-modal.component';
import { ContinueSubscriptionModalComponent } from '@private/features/profile/modal/continue-subscription/continue-subscription-modal.component';
import { DiscountAvailableUnsubscribeInAppModalComponent } from '@private/features/profile/modal/discount-available-unsubscribe-in-app-modal/discount-available-unsubscribe-in-app-modal.component';
import { EditSubscriptionModalComponent } from '@private/features/profile/modal/edit-subscription/edit-subscription-modal.component';
import { ModalStatuses } from '@private/features/profile/core/modal.statuses.enum';
import { UnsubscribeInAppFirstModal } from '@private/features/profile/modal/unsubscribe-in-app-first-modal/unsubscribe-in-app-first-modal.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/core/user/user';
import { UserService } from 'app/core/user/user.service';
import { isEqual } from 'lodash-es';
import { delay, finalize, repeatWhen, take, takeWhile, tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

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
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initData();
    this.trackParamEvents();
  }

  private initData(): void {
    this.loading = true;
    const subscriptions$ = this.subscriptionsService.getSubscriptions(false);

    subscriptions$
      .pipe(
        take(1),
        finalize(() => {
          this.loading = false;
          this.trackPageView();
        })
      )
      .subscribe((subscriptions) => {
        const user = this.userService.user;

        this.user = user;
        this.subscriptions = subscriptions;
      });
  }

  private trackParamEvents(): void {
    const isSendClickProSubscription = this.route.snapshot.paramMap.get('sendClickProSubscription') === 'true';

    if (isSendClickProSubscription) {
      this.trackClickProSubscription();
    }
  }

  public openSubscriptionModal(subscription: SubscriptionsResponse): void {
    const modal = this.getModalTypeDependingOnSubscription(subscription);
    let modalRef: NgbModalRef = this.modalService.open(modal, {
      windowClass: 'review',
    });
    modalRef.componentInstance.subscription = subscription;
    modalRef.componentInstance.isNewSubscriber = !this.subscriptionsService.hasOneStripeSubscription(this.subscriptions);
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
      .getLoggedUserInformation()
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
          this.router.navigate(['profile/subscriptions']), (this.loading = false);
        })
      )
      .subscribe((updatedSubscriptions) => {
        if (!isEqual(this.subscriptions, updatedSubscriptions)) {
          this.subscriptions = updatedSubscriptions;
          this.loading = false;
        }
      });
  }

  private trackPageView(): void {
    const source = (this.route.snapshot.queryParamMap.get('source') as SUBSCRIPTION_SOURCE) || null;
    const subscriptionIds = this.subscriptionsService.getTrialSubscriptionsIds(this.subscriptions);

    let stringIds: string = null;

    if (subscriptionIds.length > 0) {
      stringIds = subscriptionIds.sort((a, b) => a - b).join(', ');
    }

    const pageView: AnalyticsPageView<ViewSubscription> = {
      name: ANALYTICS_EVENT_NAMES.ViewSubscription,
      attributes: {
        screenId: SCREEN_IDS.SubscriptionManagement,
        isPro: this.user.featured,
        freeTrialSubscriptions: stringIds,
        source,
      },
    };
    this.analyticsService.trackPageView(pageView);
  }

  private trackOpenModalEvent(subscription: SubscriptionsResponse, modalType: SubscriptionModal) {
    if (modalType === AddNewSubscriptionModalComponent) {
      const event: AnalyticsEvent<ClickSubscriptionManagementPlus> = {
        name: ANALYTICS_EVENT_NAMES.ClickSubscriptionManagementPlus,
        eventType: ANALYTIC_EVENT_TYPES.Navigation,
        attributes: {
          screenId: SCREEN_IDS.SubscriptionManagement,
          subscription: subscription.category_id as SUBSCRIPTION_CATEGORIES,
          isNewSubscriber: !this.subscriptionsService.hasOneStripeSubscription(this.subscriptions),
          freeTrial: this.subscriptionsService.hasTrial(subscription),
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

  private getModalTypeDependingOnSubscription(subscription: SubscriptionsResponse): SubscriptionModal {
    // User is trying to edit subscription that is from inapp and has discount
    if (this.subscriptionsService.isSubscriptionInApp(subscription) && this.subscriptionsService.hasOneTierDiscount(subscription)) {
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

  private trackClickProSubscription(): void {
    const event: AnalyticsEvent<ClickProSubscription> = {
      name: ANALYTICS_EVENT_NAMES.ClickProSubscription,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.WebHome,
        isLoggedIn: true,
      },
    };
    return this.analyticsService.trackEvent(event);
  }
}
