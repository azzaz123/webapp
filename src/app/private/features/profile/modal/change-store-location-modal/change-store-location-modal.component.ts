import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-change-store-location-modal',
  templateUrl: './change-store-location-modal.component.html',
  styleUrls: ['./change-store-location-modal.component.scss'],
})
export class ChangeStoreLocationModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
