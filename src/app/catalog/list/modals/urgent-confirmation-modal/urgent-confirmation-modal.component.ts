import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Item, WindowRef } from 'shield';

@Component({
  selector: 'tsl-urgent-confirmation-modal',
  templateUrl: './urgent-confirmation-modal.component.html',
  styleUrls: ['./urgent-confirmation-modal.component.scss']
})
export class UrgentConfirmationModalComponent {

  public item: Item;
  public code: string;

  constructor(public activeModal: NgbActiveModal,
              private window: WindowRef) { }

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
