import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Item, WindowRef } from 'shield';
import { TrackingService } from '../../../../core/tracking/tracking.service';
import { UserService } from '../../../../core/user/user.service';

@Component({
  selector: 'tsl-urgent-confirmation-modal',
  templateUrl: './urgent-confirmation-modal.component.html',
  styleUrls: ['./urgent-confirmation-modal.component.scss']
})
export class UrgentConfirmationModalComponent implements OnInit {

  public item: Item;
  public code: string;

  constructor(public activeModal: NgbActiveModal,
              private window: WindowRef,
              private trackingService: TrackingService,
              private userService: UserService) { }

  ngOnInit() {
    this.userService.me().subscribe(
      () => {
        if (this.code === '200') {
          this.trackingService.track(TrackingService.URGENT_PURCHASE_SUCCESS);
          ga('send', 'event', 'Item', 'urgent-ok');
        } else {
          this.trackingService.track(TrackingService.URGENT_PURCHASE_ERROR, { error_code: this.code });
          ga('send', 'event', 'Item', 'urgent-ko');
        }
      });
  }

  public facebookShare() {
    const url = 'https://www.facebook.com/dialog/share?app_id=258778180928082&display=popup&href=' + encodeURIComponent(this.item.webLink);
    this.window.nativeWindow.open(url, 'fbShareWindow', 'height=450, width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
  }

  public twitterShare() {
    const text = 'Mira que acabo de encontrar en @Wallapop:';
    const url = 'https://twitter.com/intent/tweet?' +
      'text=' + encodeURIComponent(text) +
      '&url=' + encodeURIComponent(this.item.webLink);
    this.window.nativeWindow.open(url, 'twShareWindow', 'height=269,width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
  }

}
