import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@core/user/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { EmailModalComponent } from '@shared/profile/edit-email/email-modal/email-modal.component';
import { PROFILE_PATHS } from '../../profile-routing-constants';

@Component({
  selector: 'tsl-change-email',
  templateUrl: './change-email.component.html',
})
export class ChangeEmailComponent implements OnInit {
  public readonly VERIFICATIONS_PATH = `/${PRIVATE_PATHS.PROFILE}/${PROFILE_PATHS.VERIFICATIONS}`;

  constructor(private modalService: NgbModal, private router: Router, private userService: UserService) {}

  ngOnInit() {
    let modalRef: NgbModalRef = this.modalService.open(EmailModalComponent, {
      windowClass: 'modal-standard',
    });

    modalRef.componentInstance.currentEmail = this.userService.user.email;

    modalRef.result.then(
      () => {
        this.navigateToVerifications();
      },
      () => {
        this.navigateToVerifications();
      }
    );
  }

  private navigateToVerifications(): void {
    this.router.navigate([this.VERIFICATIONS_PATH]);
  }
}
