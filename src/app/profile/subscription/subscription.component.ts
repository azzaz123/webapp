import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddNewSubscriptionModalComponent } from './modals/add-new-subscription-modal.component';
import { SubscriptionsResponse, Tier } from '../../core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '../../core/subscriptions/subscriptions.service';
import { CancelSubscriptionModalComponent } from './modals/cancel-subscription-modal.component';
import { isEqual } from 'lodash-es';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

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
              private router: Router) {
  }

  ngOnInit() {
    this.loading = true;
    this.subscriptionsService.getSubscriptions(false).subscribe((subscriptions) => {
      this.subscriptions = subscriptions;
      this.loading = false;
    });
  }

  public openSubscriptionModal(subscription: SubscriptionsResponse): void {
    const modal = subscription.subscribed_from ? CancelSubscriptionModalComponent : AddNewSubscriptionModalComponent;
    let modalRef: NgbModalRef = this.modalService.open(modal, {windowClass: 'review'});
    modalRef.componentInstance.subscription = subscription;
    modalRef.result.then((action) => {
      if (action) {
        this.loading = true;
        this.isSubscriptionUpdated();
      }
      modalRef = null;
    }, () => {});
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
  
}
