import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, forkJoin as observableForkJoin } from 'rxjs';

import { SUBSCRIPTION_TYPES } from '../../../../core/subscriptions/subscriptions.service';
import { Item } from '../../../../core/item/item';
import { ItemService } from '../../../../core/item/item.service';
import { SubscriptionsService } from '../../../../core/subscriptions/subscriptions.service';
import { SubscriptionsResponse } from '../../../../core/subscriptions/subscriptions.interface';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'tsl-too-many-items-modal',
  templateUrl: './too-many-items-modal.component.html',
  styleUrls: ['./too-many-items-modal.component.scss']
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

  constructor(public activeModal: NgbActiveModal,
              private itemService: ItemService,
              private subscriptionsService: SubscriptionsService) { }

  ngOnInit() {
    this.hasFreeOption(this.itemId).subscribe( result => {
      this.isFreeTrial = result;
    });
  }

  private hasFreeOption(itemId: string): Observable<boolean> {
    return observableForkJoin([
      this.itemService.get(itemId),
      this.subscriptionsService.getSubscriptions(false)
    ])
    .pipe(
      map(values => {
        const item: Item = values[0];
        const subscriptions: SubscriptionsResponse[] = values[1];
        this.categorySubscription = subscriptions.find((subscription) => item.categoryId === subscription.category_id);
        if (this.categorySubscription) {
          return this.hasTrial(this.categorySubscription)
        }
        return false;
      })
    );
  }

  public hasTrial(subscription: SubscriptionsResponse): boolean {
    return this.subscriptionsService.hasTrial(subscription);
  }
}
