import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-no-card-modal',
  templateUrl: './no-card-modal.component.html',
  styleUrls: ['./no-card-modal.component.scss']
})
export class NoCardModalComponent {

  public loading: boolean;

  constructor(public activeModal: NgbActiveModal) {
  }

  public deleteCard() {
    this.activeModal.close('deleteCardModal');
  }
  
}
