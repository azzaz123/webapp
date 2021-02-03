import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, forkJoin } from 'rxjs';

import { SUBSCRIPTION_TYPES } from '../../../../core/subscriptions/subscriptions.service';
import { ItemService } from '../../../../core/item/item.service';
import { SubscriptionsService } from '../../../../core/subscriptions/subscriptions.service';
import { SubscriptionsResponse, SUBSCRIPTION_CATEGORIES } from '../../../../core/subscriptions/subscriptions.interface';
import { map } from 'rxjs/operators';
import { AnalyticsService } from 'app/core/analytics/analytics.service';
import { AnalyticsPageView, ViewProSubscriptionPopup, ANALYTICS_EVENT_NAMES, SCREEN_IDS } from 'app/core/analytics/analytics-constants';

@Component({
  selector: 'tsl-too-many-items-modal',
  templateUrl: './too-many-items-modal.component.html',
  styleUrls: ['./too-many-items-modal.component.scss'],
})
export class TooManyItemsModalComponent implements OnInit {
  public type = SUBSCRIPTION_TYPES.notSubscribed;
  public notSubscribedType = SUBSCRIPTION_TYPES.notSubscribed;
  public inAppType = SUBSCRIPTION_TYPES.inApp;
  public carDealerType = SUBSCRIPTION_TYPES.carDealer;
  public stripeType = SUBSCRIPTION_TYPES.stripe;
  public isFreeTrial: boolean;
  public categorySubscription: SubscriptionsResponse;
  @Input() itemId: string;

  public categoryName: string;
  public categoryIconName: string;

  constructor(
    public activeModal: NgbActiveModal,
    private itemService: ItemService,
    private subscriptionsService: SubscriptionsService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.hasFreeOption(this.itemId).subscribe((result) => {
      this.isFreeTrial = result;
      this.trackPageView();
    });
  }

  private trackPageView(): void {
    const event: AnalyticsPageView<ViewProSubscriptionPopup> = {
      name: ANALYTICS_EVENT_NAMES.ViewProSubscriptionPopup,
      attributes: {
        screenId: SCREEN_IDS.ProSubscriptionLimitPopup,
        subscription: this.categorySubscription.category_id as SUBSCRIPTION_CATEGORIES,
        freeTrial: this.isFreeTrial,
        isCarDealer: this.type === this.carDealerType,
      },
    };

    this.analyticsService.trackPageView(event);
  }

  private hasFreeOption(itemId: string): Observable<boolean> {
    return forkJoin([this.itemService.get(itemId), this.subscriptionsService.getSubscriptions(false)]).pipe(
      map((values) => {
        const item = values[0];
        const subscriptions = values[1];
        this.categorySubscription = subscriptions.find((subscription) => item.categoryId === subscription.category_id);

        if (this.categorySubscription) {
          return this.subscriptionsService.hasTrial(this.categorySubscription);
        }
        return false;
      })
    );
  }
}
