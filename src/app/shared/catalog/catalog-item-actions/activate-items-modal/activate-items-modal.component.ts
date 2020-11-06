import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-activate-items-modal',
  templateUrl: './activate-items-modal.component.html',
})
export class ActivateItemsModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
