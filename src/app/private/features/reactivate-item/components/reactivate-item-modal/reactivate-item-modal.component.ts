import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-reactivate-item-modal',
  templateUrl: './reactivate-item-modal.component.html',
  styleUrls: ['./reactivate-item-modal.component.scss'],
})
export class ReactivateItemModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
