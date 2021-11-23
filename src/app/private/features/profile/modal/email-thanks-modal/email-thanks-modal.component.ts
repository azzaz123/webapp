import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailThanksModalCopies } from './interfaces';

@Component({
  selector: 'tsl-email-thanks-modal',
  templateUrl: './email-thanks-modal.component.html',
  styleUrls: ['./email-thanks-modal.component.scss'],
})
export class EmailThanksModalComponent {
  @Input() copies: EmailThanksModalCopies;

  constructor(public activeModal: NgbActiveModal) {}
}
