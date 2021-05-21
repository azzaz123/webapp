import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-delete-delivery-address-modal.component',
  templateUrl: './delete-delivery-address-modal.component.html',
})
export class DeleteDeliveryAddressModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
