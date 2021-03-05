import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-listingfee-confirmation-modal',
  templateUrl: './listingfee-confirmation-modal.component.html',
  styleUrls: ['./listingfee-confirmation-modal.component.scss'],
})
export class ListingfeeConfirmationModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
