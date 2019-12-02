import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TrackingService } from '../../../../core/tracking/tracking.service';
import { UserService } from '../../../../core/user/user.service';
import { SplitTestService, WEB_PAYMENT_EXPERIMENT_SUCCESSFUL_EVENT } from '../../../../core/tracking/split-test.service';

@Component({
  selector:    'tsl-pro-bump-confirmation-modal',
  templateUrl: './pro-bump-confirmation-modal.component.html',
  styleUrls:   ['./pro-bump-confirmation-modal.component.scss']
})
export class ProBumpConfirmationModalComponent implements OnInit {

  public code: string;
  public extras: string;

  constructor(public activeModal: NgbActiveModal,
              private trackingService: TrackingService,
              private userService: UserService,
              private splitTestService: SplitTestService) {
  }

  ngOnInit() {
    this.userService.me().subscribe(
      () => {
        if (this.code === '200' || this.code === '201') {
          this.trackingService.track(TrackingService.PRO_FEATURED_PURCHASE_SUCCESS);
          this.splitTestService.track(WEB_PAYMENT_EXPERIMENT_SUCCESSFUL_EVENT);
        } else {
          this.trackingService.track(TrackingService.PRO_FEATURED_PURCHASE_ERROR);
        }
      });
  }

}
