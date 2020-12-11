import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-become-pro-modal',
  templateUrl: './become-pro-modal.component.html',
  styleUrls: ['./become-pro-modal.component.scss'],
})
export class BecomeProModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
