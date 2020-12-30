import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-wallacoins-disabled-modal',
  templateUrl: './wallacoins-disabled-modal.component.html',
  styleUrls: ['./wallacoins-disabled-modal.component.scss'],
})
export class WallacoinsDisabledModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
