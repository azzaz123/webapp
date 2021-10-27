import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@core/user/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { PROFILE_PATHS } from '../../profile-routing-constants';
import { EmailVerificationModalComponent } from './modals/email-verification-modal/email-verification-modal.component';

@Component({
  selector: 'tsl-email-verification',
  templateUrl: './email-verification.component.html',
})
export class EmailVerificationComponent implements OnInit {
  public readonly VERIFICATIONS_PATH = `/${PRIVATE_PATHS.PROFILE}/${PROFILE_PATHS.VERIFICATIONS}`;

  constructor(private modalService: NgbModal, private router: Router, private userService: UserService) {}

  ngOnInit() {
    let modalRef: NgbModalRef = this.modalService.open(EmailVerificationModalComponent, {
      windowClass: 'modal-standard',
    });

    modalRef.componentInstance.email = this.userService.user.email;

    modalRef.result.then(
      () => {
        this.router.navigate([this.VERIFICATIONS_PATH]);
      },
      () => {
        this.router.navigate([this.VERIFICATIONS_PATH]);
      }
    );
  }
}
