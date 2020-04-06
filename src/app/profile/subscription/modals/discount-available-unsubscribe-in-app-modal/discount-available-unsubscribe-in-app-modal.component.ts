import { Component, OnInit } from '@angular/core';
import { SUPPORT_MAIL } from '../../../../core/constants';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-discount-available-unsubscribe-in-app-modal',
  templateUrl: './discount-available-unsubscribe-in-app-modal.component.html',
  styleUrls: ['./discount-available-unsubscribe-in-app-modal.component.scss']
})
export class DiscountAvailableUnsubscribeInAppModalComponent implements OnInit {

  public supportMail = SUPPORT_MAIL;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
