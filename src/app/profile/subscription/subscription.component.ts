import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddNewSubscriptionModalComponent } from './modals/add-new-subscription-modal.component';
import { SubscriptionsResponse, Tier } from '../../core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '../../core/subscriptions/subscriptions.service';
import { CategoryService } from '../../core/category/category.service';
import { flatMap, map, mergeMap } from 'rxjs/operators';
import { CancelSubscriptionModalComponent } from './modals/cancel-subscription-modal.component';
import { EventService } from '../../core/event/event.service';
import { Observable } from 'rxjs';


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
              private eventService: EventService) {
  }

  ngOnInit() {
    this.loading = true;
    this.subscriptionsService.getSubscriptions(false).subscribe((subscriptions) => {
      this.subscriptions = subscriptions;
      this.loading = false;
    });
    this.eventService.subscribe('subscriptionChange', () => {
      this.isSubscriptionUpdated();
    });
  }

  public openSubscriptionModal(subscription: SubscriptionsResponse): void {
    const modal = subscription.subscribed_from ? CancelSubscriptionModalComponent : AddNewSubscriptionModalComponent;
    let modalRef: NgbModalRef = this.modalService.open(modal, {windowClass: 'review'});
    modalRef.componentInstance.subscription = subscription;
    modalRef.result.then(() => {
      this.action = 'clear';
      modalRef = null;
    }, () => {});
  }

  private isSubscriptionUpdated() {
    this.subscriptionsService.getSubscriptions(false).subscribe((updatedSubscriptions) => {
      console.log('updatedSubscriptions: ', updatedSubscriptions);
      console.log('this.subscriptions: ', this.subscriptions);
    });
  }
  
}
