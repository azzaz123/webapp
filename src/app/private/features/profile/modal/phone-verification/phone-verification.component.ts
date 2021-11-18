import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@core/user/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { PROFILE_PATHS } from '../../profile-routing-constants';
import { PhoneVerificationModalComponent } from './modals/phone-verification-modal/phone-verification-modal.component';

@Component({
  selector: 'tsl-phone-verification',
  templateUrl: './phone-verification.component.html',
})
export class PhoneVerificationComponent implements OnInit {
  public readonly VERIFICATIONS_PATH = `/${PRIVATE_PATHS.PROFILE}/${PROFILE_PATHS.VERIFICATIONS}`;

  constructor(private modalService: NgbModal, private router: Router, private userService: UserService) {}

  ngOnInit() {
    let modalRef: NgbModalRef = this.modalService.open(PhoneVerificationModalComponent, {
      windowClass: 'modal-standard',
    });

    modalRef.componentInstance.email = this.userService.user.email;

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
