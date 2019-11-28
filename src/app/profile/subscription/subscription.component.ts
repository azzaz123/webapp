import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddNewSubscriptionModalComponent } from './modals/add-new-subscription-modal.component';
import { SubscriptionsResponse } from '../../core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '../../core/subscriptions/subscriptions.service';
import { CancelSubscriptionModalComponent } from './modals/cancel-subscription-modal.component';
import { isEqual } from 'lodash-es';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
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

@Component({
  selector: 'tsl-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit {
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
    this.subscriptionsService.getSubscriptions(false).subscribe((subscriptions) => {
      this.subscriptions = subscriptions;
      this.loading = false;
    });

    const pageView: AnalyticsPageView<ViewProfileSubscription> = {
      name: ANALYTICS_EVENT_NAMES.ViewProfileSubscription,
      attributes: {
        screenId: SCREEN_IDS.ProfileSubscription
      }
    };

    this.analyticsService.trackPageView(pageView);
  }

  public openSubscriptionModal(subscription: SubscriptionsResponse): void {
    const modal = subscription.subscribed_from ? CancelSubscriptionModalComponent : AddNewSubscriptionModalComponent;
    let modalRef = this.modalService.open(modal, {windowClass: 'review'});
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
    .repeatWhen(completed => completed.delay(1000).takeWhile(() => this.loading)).take(5)
    .pipe( 
      finalize(() => {
        this.router.navigate(['profile/info']);
      })
    )
    .subscribe(
      (updatedSubscriptions) => {
      if (!isEqual(this.subscriptions, updatedSubscriptions)) {
        this.loading = false;
      }
    });
  }

  private trackOpenModalEvent(subscription: SubscriptionsResponse) {
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

  private trackCloseModalEvent() {
    const event: AnalyticsEvent<ClickUnsuscribeCancelation> = {
      name: ANALYTICS_EVENT_NAMES.ClickUnsuscribeCancelation,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        screenId: SCREEN_IDS.ProfileSubscription
      }
    };
    this.analyticsService.trackEvent(event);
  }

}
