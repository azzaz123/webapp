import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionsResponse } from '../../../core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '../../../core/subscriptions/subscriptions.service';

@Component({
  selector: 'tsl-cancel-subscription-modal',
  templateUrl: './cancel-subscription-modal.component.html',
  styleUrls: ['./cancel-subscription-modal.component.scss']
})

export class CancelSubscriptionModalComponent {

  public loading = false;
  public subscription: SubscriptionsResponse;

  constructor(public activeModal: NgbActiveModal,
              public subscriptionsService: SubscriptionsService) {
  }

  public close() {
    this.activeModal.close();
  }

  public cancelSubscription() {
    this.loading = true;
    this.subscriptionsService.cancelSubscription(this.subscription.selected_tier_id).subscribe((response) => {
      console.log('response ', response);
      this.loading = true;
      this.close();
    });
    
  }

}