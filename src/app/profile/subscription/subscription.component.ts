import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddNewSubscriptionModalComponent } from './modals/add-new-subscription-modal.component';
import { SubscriptionsResponse, Tier } from '../../core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '../../core/subscriptions/subscriptions.service';
import { CategoryService } from '../../core/category/category.service';
import { flatMap } from 'rxjs/operators';
import { EventService } from '../../core/event/event.service';
import { CancelSubscriptionModalComponent } from './modals/cancel-subscription-modal.component';


@Component({
  selector: 'tsl-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit {
  public action: string;
  public subscriptions: SubscriptionsResponse[];

  constructor(private modalService: NgbModal,
              private subscriptionsService: SubscriptionsService,
              private categoryService: CategoryService,
              private eventService: EventService) {
  }

  ngOnInit() {
    this.getSubscriptions(false);
    this.eventService.subscribe('subscriptionChange', () => {
      this.getSubscriptions(false);
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

  private getSubscriptions(cache: boolean = true): void {
    this.categoryService.getCategories()
    .pipe(
      flatMap(categories => this.subscriptionsService.getSubscriptions(categories, cache)),
    )
    .subscribe(response => this.subscriptions = response); 
  }

  
}
