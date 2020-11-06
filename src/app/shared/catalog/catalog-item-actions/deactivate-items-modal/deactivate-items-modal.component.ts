import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-deactivate-items-modal',
  templateUrl: './deactivate-items-modal.component.html',
})
export class DeactivateItemsModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
