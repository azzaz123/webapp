import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../../../core/user/user.service';
import { TrackingService } from '../../../../../core/tracking/tracking.service';

@Component({
  selector:    'tsl-pro-bump-confirmation-modal',
  templateUrl: './pro-bump-confirmation-modal.component.html',
  styleUrls:   ['./pro-bump-confirmation-modal.component.scss']
})
export class ProBumpConfirmationModalComponent implements OnInit {

  public code: string;

  constructor(public activeModal: NgbActiveModal,
              private trackingService: TrackingService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.userService.me().subscribe(
      () => {
        if (this.code === '200') {
          this.trackingService.track(TrackingService.PRO_FEATURED_PURCHASE_SUCCESS);
        } else {
          this.trackingService.track(TrackingService.PRO_FEATURED_PURCHASE_ERROR);
        }
      });
  }

}