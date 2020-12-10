import { Component, OnInit } from '@angular/core';
import {
  SUPPORT_MAIL,
  APPLE_STORE_SUBSCRIPTIONS_HELP_URL,
  GOOGLE_PLAY_SUBSCRIPTIONS_HELP_URL,
} from '../../../../core/constants';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-discount-available-unsubscribe-in-app-modal',
  templateUrl: './discount-available-unsubscribe-in-app-modal.component.html',
  styleUrls: ['./discount-available-unsubscribe-in-app-modal.component.scss'],
})
export class DiscountAvailableUnsubscribeInAppModalComponent implements OnInit {
  public supportMail = SUPPORT_MAIL;
  public appleStoreSubscriptionsHelpURL = APPLE_STORE_SUBSCRIPTIONS_HELP_URL;
  public googlePlaySubscriptionsHelpURL = GOOGLE_PLAY_SUBSCRIPTIONS_HELP_URL;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}
}
