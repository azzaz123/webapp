import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-confirm-card-modal',
  templateUrl: './confirm-card-modal.component.html',
  styleUrls: ['./confirm-card-modal.component.scss']
})
export class ConfirmCardModalComponent {

  constructor(public activeModal: NgbActiveModal) {
  }

  public confirmChange() {
    this.activeModal.close('changeCardModal');
  }
  
  
}
