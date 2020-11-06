import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-delete-item',
  templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModalComponent {
  public type: number;

  constructor(public activeModal: NgbActiveModal) {}
}
