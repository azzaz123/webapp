import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-block-user',
  templateUrl: './block-user.component.html',
})
export class BlockUserComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
