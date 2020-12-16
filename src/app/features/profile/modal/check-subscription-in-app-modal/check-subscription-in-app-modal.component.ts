import { Component } from '@angular/core';
import { SUPPORT_MAIL } from '@core/constants';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-check-subscription-in-app-modal',
  templateUrl: './check-subscription-in-app-modal.component.html',
  styleUrls: ['./check-subscription-in-app-modal.component.scss'],
})
export class CheckSubscriptionInAppModalComponent {
  public supportMail = SUPPORT_MAIL;
  constructor(public activeModal: NgbActiveModal) {}
}
