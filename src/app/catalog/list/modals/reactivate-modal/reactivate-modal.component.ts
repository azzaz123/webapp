import { Component } from '@angular/core';
import { Item } from 'shield';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-reactivate-modal',
  templateUrl: './reactivate-modal.component.html',
  styleUrls: ['./reactivate-modal.component.scss']
})
export class ReactivateModalComponent {

  public price: number;

  constructor(public activeModal: NgbActiveModal) {
  }

}
