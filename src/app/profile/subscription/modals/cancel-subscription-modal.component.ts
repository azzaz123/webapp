import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionsResponse } from '../../../core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-cancel-subscription-modal',
  templateUrl: './cancel-subscription-modal.component.html',
  styleUrls: ['./cancel-subscription-modal.component.scss']
})

export class CancelSubscriptionModalComponent implements OnInit {

  public loading = false;
  public subscription: SubscriptionsResponse;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

  public close() {
    this.activeModal.close();
  }

  public cancelSubscription() {
    this.loading = true;
    //cancel subs endpoint
    this.close();
  }

}
