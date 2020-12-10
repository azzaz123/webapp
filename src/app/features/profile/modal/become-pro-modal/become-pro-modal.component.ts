import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../core/user/user';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-become-pro-modal',
  templateUrl: './become-pro-modal.component.html',
  styleUrls: ['./become-pro-modal.component.scss'],
})
export class BecomeProModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
