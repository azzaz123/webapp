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
  public subscriptionModal: NgbModalRef;

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
        screenId: 205 // TODO: Wait mparticle branch to be updated
      }
    };

    this.analyticsService.trackPageView(pageView);
  }

  public openSubscriptionModal(subscription: SubscriptionsResponse): void {
    const modal = subscription.subscribed_from ? CancelSubscriptionModalComponent : AddNewSubscriptionModalComponent;
    this.subscriptionModal = this.modalService.open(modal, {windowClass: 'review'});
    this.subscriptionModal.componentInstance.subscription = subscription;
    this.subscriptionModal.result.then((action: string) => {
      if (action) {
        this.loading = true;
        this.isSubscriptionUpdated();
      }
      this.subscriptionModal = null;
    }, () => {
      this.trackCloseModalEvent();
      this.subscriptionModal = null;
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
          screenId: 205, // TODO: wait mparticle branch update
          subscription: subscription.category_id as any
        }
      };

      this.analyticsService.trackEvent(event);
    } else {
      const event: AnalyticsEvent<ClickProfileSubscribeButton> = {
        name: ANALYTICS_EVENT_NAMES.ClickProfileSubscribeButton,
        eventType: ANALYTIC_EVENT_TYPES.Other,
        attributes: {
          screenId: 205, // TODO: wait mparticle branch update
          subscription: subscription.category_id as any
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
        screenId: 205
      }
    };
    this.analyticsService.trackEvent(event);
  }

}
