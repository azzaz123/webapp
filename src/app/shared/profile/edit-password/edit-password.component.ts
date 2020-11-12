import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PasswordModalComponent } from './password-modal/password-modal.component';

@Component({
  selector: 'tsl-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss'],
})
export class EditPasswordComponent {
  constructor(private modalService: NgbModal) {}

  openModal(element: HTMLElement) {
    element.blur();
    this.modalService.open(PasswordModalComponent, {
      windowClass: 'account-details',
    });
  }
}
