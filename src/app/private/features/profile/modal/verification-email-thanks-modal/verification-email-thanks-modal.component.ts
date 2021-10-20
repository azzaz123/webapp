import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-verification-email-thanks-modal',
  templateUrl: './verification-email-thanks-modal.component.html',
  styleUrls: ['./verification-email-thanks-modal.component.scss'],
})
export class VerificationEmailThanksModalComponent {
  @Input() email: string;
  constructor(public activeModal: NgbActiveModal) {}
}
