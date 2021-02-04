import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { APPLE_STORE_SUBSCRIPTIONS_HELP_URL, GOOGLE_PLAY_SUBSCRIPTIONS_HELP_URL, SUPPORT_MAIL } from '@core/constants';

@Component({
  selector: 'tsl-discount-available-unsubscribe-in-app-modal',
  templateUrl: './discount-available-unsubscribe-in-app-modal.component.html',
  styleUrls: ['./discount-available-unsubscribe-in-app-modal.component.scss'],
})
export class DiscountAvailableUnsubscribeInAppModalComponent {
  public supportMail = SUPPORT_MAIL;
  public appleStoreSubscriptionsHelpURL = APPLE_STORE_SUBSCRIPTIONS_HELP_URL;
  public googlePlaySubscriptionsHelpURL = GOOGLE_PLAY_SUBSCRIPTIONS_HELP_URL;

  constructor(public activeModal: NgbActiveModal) {}
}
