import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TrackingService, UserService } from 'shield';

@Component({
  selector:    'tsl-bump-confirmation-modal',
  templateUrl: './bump-confirmation-modal.component.html',
  styleUrls:   ['./bump-confirmation-modal.component.scss']
})
export class BumpConfirmationModalComponent implements OnInit {

  public code: string;

  constructor(public activeModal: NgbActiveModal,
              private trackingService: TrackingService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.userService.me().subscribe(
      () => {
        if (this.code === '200') {
          this.trackingService.track(TrackingService.FEATURED_PURCHASE_SUCCESS);
        } else {
          this.trackingService.track(TrackingService.FEATURED_PURCHASE_ERROR, { code_error: this.code });
        }
      });
  }

}
