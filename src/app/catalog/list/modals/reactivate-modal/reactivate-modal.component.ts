import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from '../../../../core/item/item';

@Component({
  selector: 'tsl-reactivate-modal',
  templateUrl: './reactivate-modal.component.html',
  styleUrls: ['./reactivate-modal.component.scss']
})
export class ReactivateModalComponent {

  public price: number;
  public item: Item;

  constructor(public activeModal: NgbActiveModal) {
  }

}
