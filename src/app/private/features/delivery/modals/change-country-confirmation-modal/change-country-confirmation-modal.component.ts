import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-change-country-confirmation-modal',
  templateUrl: './change-country-confirmation-modal.component.html',
})
export class ChangeCountryConfirmationModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
