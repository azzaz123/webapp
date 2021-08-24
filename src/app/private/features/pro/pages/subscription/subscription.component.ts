import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickProfileEditCurrentSubscription,
  ClickProSubscription,
  SCREEN_IDS,
  ViewSubscription,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { SubscriptionsResponse, SUBSCRIPTION_CATEGORIES, SUBSCRIPTION_SOURCE } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { ModalStatuses } from '@private/features/pro/modal/modal.statuses.enum';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/core/user/user';
import { UserService } from 'app/core/user/user.service';
import { isEqual } from 'lodash-es';
import { delay, finalize, repeatWhen, take, takeWhile } from 'rxjs/operators';
import { CancelSubscriptionModalComponent } from '../../modal/cancel-subscription/cancel-subscription-modal.component';
import { CheckSubscriptionInAppModalComponent } from '../../modal/check-subscription-in-app-modal/check-subscription-in-app-modal.component';
import { ContinueSubscriptionModalComponent } from '../../modal/continue-subscription/continue-subscription-modal.component';
import { UnsubscribeInAppFirstModalComponent } from '../../modal/unsubscribe-in-app-first-modal/unsubscribe-in-app-first-modal.component';

export type SubscriptionModal =
  | typeof CheckSubscriptionInAppModalComponent
  | typeof CancelSubscriptionModalComponent
  | typeof ContinueSubscriptionModalComponent;

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
  public newSubscription: SubscriptionsResponse = null;
  public editSubscription: SubscriptionsResponse = null;

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

  public onUnselectSubcription(): void {
    this.newSubscription = null;
    this.editSubscription = null;
  }

  public setNewSubscription(subscription: SubscriptionsResponse) {
    this.newSubscription = subscription;
  }

  public manageSubscription(subscription: SubscriptionsResponse): void {
    const modal = this.getModalTypeDependingOnSubscription(subscription);
    if (!modal) {
      this.openSubscriptionPage(subscription);
    } else {
      this.openSubscriptionModal(subscription, modal);
    }
  }

  private openSubscriptionPage(subscription): void {
    this.subscriptionsService.isStripeSubscription(subscription)
      ? this.openEditSubscription(subscription)
      : this.setNewSubscription(subscription);
  }

  private openEditSubscription(subscription: SubscriptionsResponse): void {
    this.editSubscription = subscription;
    this.trackEditSubscription(subscription);
  }

  public subscriptionChangeSuccessful(redirect?: string): void {
    this.newSubscription = null;
    this.editSubscription = null;
    this.loading = true;
    if (this.user.featured) {
      this.isSubscriptionUpdated(redirect);
      return;
    }
    this.isUserUpdated(redirect);
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

  private openSubscriptionModal(subscription: SubscriptionsResponse, modal: SubscriptionModal): void {
    let modalRef: NgbModalRef = this.modalService.open(modal, {
      windowClass: 'review',
    });
    modalRef.componentInstance.subscription = subscription;
    modalRef.componentInstance.isNewSubscriber = !this.subscriptionsService.hasOneStripeSubscription(this.subscriptions);
    modalRef.result.then(
      (action: ModalStatuses) => {
        if (action) {
          this.subscriptionChangeSuccessful();
        }
        modalRef = null;
      },
      () => {
        modalRef = null;
      }
    );
  }

  private isUserUpdated(redirect?: string): void {
    this.userService
      .getAndUpdateLoggedUser()
      .pipe(
        repeatWhen((completed) =>
          completed.pipe(
            delay(1000),
            takeWhile(() => this.loading)
          )
        ),
        take(30),
        finalize(() => {
          this.redirectIfNeeded(redirect);
        })
      )
      .subscribe((updatedUser) => {
        if (updatedUser.featured) {
          this.loading = false;
        }
      });
  }

  private isSubscriptionUpdated(redirect?: string): void {
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
          this.redirectIfNeeded(redirect);
        })
      )
      .subscribe((updatedSubscriptions) => {
        if (!isEqual(this.subscriptions, updatedSubscriptions)) {
          this.subscriptions = updatedSubscriptions;
          this.loading = false;
        }
      });
  }

  private redirectIfNeeded(redirect?: string): void {
    if (redirect) {
      this.router.navigate([redirect]);
    }
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

  private trackEditSubscription(subscription: SubscriptionsResponse): void {
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

  private getModalTypeDependingOnSubscription(subscription: SubscriptionsResponse): SubscriptionModal {
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

    // User is trying to subscribe but there is an active inapp subscription
    if (this.subscriptionsService.isOneSubscriptionInApp(this.subscriptions)) {
      return UnsubscribeInAppFirstModalComponent;
    }
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
