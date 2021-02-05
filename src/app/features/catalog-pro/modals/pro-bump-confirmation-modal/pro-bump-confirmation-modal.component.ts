import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '@core/user/user.service';

@Component({
  selector: 'tsl-pro-bump-confirmation-modal',
  templateUrl: './pro-bump-confirmation-modal.component.html',
  styleUrls: ['./pro-bump-confirmation-modal.component.scss'],
})
export class ProBumpConfirmationModalComponent implements OnInit {
  public code: string;
  public extras: string;

  constructor(public activeModal: NgbActiveModal, private userService: UserService) {}

  ngOnInit() {
    this.userService.me().subscribe(() => {
      if (this.code === '200' || this.code === '201') {
        appboy.logCustomEvent('VisibilityPurchaseSuccess', { platform: 'web' });
      } else {
      }
    });
  }
}
