import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SUBSCRIPTION_TYPES } from '../../../../core/subscriptions/subscriptions.service';

@Component({
  selector: 'tsl-too-many-items-modal',
  templateUrl: './too-many-items-modal.component.html',
  styleUrls: ['./too-many-items-modal.component.scss']
})
export class TooManyItemsModalComponent implements OnInit {

  public type = SUBSCRIPTION_TYPES.normal;
  public normalType = SUBSCRIPTION_TYPES.normal;
  public motorPlanType = SUBSCRIPTION_TYPES.motorPlan;
  public carDealerType = SUBSCRIPTION_TYPES.carDealer;
  public webSubscriptionType = SUBSCRIPTION_TYPES.web;

  public categoryName: string;
  public categoryIconName: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }
}
