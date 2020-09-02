import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-delete-info-confirmation-modal',
  templateUrl: './delete-info-confirmation-modal.component.html',
  styleUrls: ['./delete-info-confirmation-modal.component.scss']
})
export class DeleteInfoConfirmationModalComponent {

  constructor(public activeModal: NgbActiveModal) { }
}
