import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-exit-confirmation-modal',
  templateUrl: './exit-confirmation-modal.component.html'
})
export class ExitConfirmationModalComponent {

  constructor(public activeModal: NgbActiveModal) { }

}
