import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddNewSubscriptionModalComponent } from './modals/add-new-subscription-modal.component';
import { SubscriptionsResponse, Tier } from '../../core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '../../core/subscriptions/subscriptions.service';
import { SubscriptionsModel } from '../../core/subscriptions/subscriptions.model';


@Component({
  selector: 'tsl-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit {
  public action: string;
  public subscriptions: SubscriptionsResponse[];

  constructor(private modalService: NgbModal,
              private subscriptionsService: SubscriptionsService) {
  }

  ngOnInit() {
    this.getSubscriptions();
  }

  public openSubscriptionModal(subscription: SubscriptionsModel): void {
    let modalRef: NgbModalRef = this.modalService.open(AddNewSubscriptionModalComponent, {windowClass: 'review'});
    modalRef.componentInstance.subscription = subscription;
    modalRef.result.then(() => {
      this.action = 'clear';
      modalRef = null;
    }, () => {});
  }

  public getSubscriptions(): void {
    this.subscriptionsService.getSubscriptions().subscribe((response: SubscriptionsResponse[]) => {
      this.subscriptions = response;
    });
  }

  
}
