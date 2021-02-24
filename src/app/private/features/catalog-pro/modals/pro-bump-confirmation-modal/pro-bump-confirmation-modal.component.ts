import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-pro-bump-confirmation-modal',
  templateUrl: './pro-bump-confirmation-modal.component.html',
  styleUrls: ['./pro-bump-confirmation-modal.component.scss'],
})
export class ProBumpConfirmationModalComponent {
  public code: string;
  public extras: string;

  constructor(public activeModal: NgbActiveModal) {}
}
