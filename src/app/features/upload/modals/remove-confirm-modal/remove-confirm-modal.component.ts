import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-remove-confirm-modal',
  templateUrl: './remove-confirm-modal.component.html',
})
export class RemoveConfirmModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
