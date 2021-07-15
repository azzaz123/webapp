import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-visibility-products-modal',
  templateUrl: './visibility-products-modal.component.html',
  styleUrls: ['./visibility-products-modal.component.scss'],
})
export class VisibilityProductsModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
