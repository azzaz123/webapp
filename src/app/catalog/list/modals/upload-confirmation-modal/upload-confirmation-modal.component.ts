import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Item, WindowRef } from 'shield';
import { TrackingService } from '../../../../core/tracking/tracking.service';

@Component({
  selector: 'tsl-upload-confirmation-modal',
  templateUrl: './upload-confirmation-modal.component.html',
  styleUrls: ['./upload-confirmation-modal.component.scss']
})
export class UploadConfirmationModalComponent implements OnInit {

  public item: Item;

  constructor(public activeModal: NgbActiveModal,
              private window: WindowRef,
              private trackingService: TrackingService) {
  }

  ngOnInit() {
    this.trackingService.track(TrackingService.UPLOADFORM_SUCCESS);
    gtag('event', 'conversion', {'send_to': 'AW-829909973/7aOVCJvxvHsQ1dfdiwM'});
    fbq('track', '567634953582843', {});
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
