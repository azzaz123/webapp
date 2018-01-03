import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailModalComponent } from './email-modal/email-modal.component';

@Component({
  selector: 'tsl-edit-email',
  templateUrl: './edit-email.component.html',
  styleUrls: ['./edit-email.component.scss']
})
export class EditEmailComponent {

  @Input() email: string;

  constructor(private modalService: NgbModal) {
  }

  openModal(element: HTMLElement) {
    element.blur();
    this.modalService.open(EmailModalComponent, {windowClass: 'account-details'});
  }

}
