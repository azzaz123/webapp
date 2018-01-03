import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EmailModalComponent } from './email-modal/email-modal.component';

@Component({
  selector: 'tsl-edit-email',
  templateUrl: './edit-email.component.html',
  styleUrls: ['./edit-email.component.scss']
})
export class EditEmailComponent implements OnInit {

  @Input() email: string;

  constructor(private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  openModal() {
    this.modalService.open(EmailModalComponent, {windowClass: 'account-details'}).result.then((email: string) => {
      this.email = email;
    }, () => {
    });
  }

}
