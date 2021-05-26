import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalProperties } from './confirmation-modal.interface';

@Component({
  selector: 'tsl-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModalComponent {
  public properties: ConfirmationModalProperties;

  constructor(public activeModal: NgbActiveModal) {}
}
