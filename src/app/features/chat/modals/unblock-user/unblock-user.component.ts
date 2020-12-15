import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-unblock-user',
  templateUrl: './unblock-user.component.html',
})
export class UnblockUserComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
