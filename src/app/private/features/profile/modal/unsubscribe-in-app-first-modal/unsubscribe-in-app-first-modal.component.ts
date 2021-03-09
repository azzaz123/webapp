import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SUPPORT_MAIL } from '@core/constants';

@Component({
  selector: 'tsl-unsubscribe-in-app-first-modal',
  templateUrl: './unsubscribe-in-app-first-modal.component.html',
  styleUrls: ['./unsubscribe-in-app-first-modal.component.scss'],
})
export class UnsubscribeInAppFirstModal {
  public supportMail = SUPPORT_MAIL;
  constructor(public activeModal: NgbActiveModal) {}
}
