import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from '../../core/item/item';

@Component({
  selector: 'tsl-exit-confirmation-modal',
  templateUrl: './exit-confirmation-modal.component.html',
})
export class ExitConfirmationModalComponent {
  public item: Item;

  constructor(public activeModal: NgbActiveModal) {}
}
