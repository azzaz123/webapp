import { Component } from '@angular/core';
import { I18nService } from '@core/i18n/i18n.service';
import { Item } from '@core/item/item';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-pro-urgent-confirmation-modal',
  templateUrl: './pro-urgent-confirmation-modal.component.html',
  styleUrls: ['./pro-urgent-confirmation-modal.component.scss'],
})
export class ProUrgentConfirmationModalComponent {
  public item: Item;
  public code: string;

  constructor(public activeModal: NgbActiveModal, private i18n: I18nService) {}

  public facebookShare() {
    const url =
      'https://www.facebook.com/dialog/share?app_id=258778180928082&display=popup&href=' +
      encodeURIComponent(this.item.webLink);
    window.open(
      url,
      'fbShareWindow',
      'height=450, width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0'
    );
  }

  public twitterShare() {
    const text = this.i18n.getTranslations('twitterShare');
    const url =
      'https://twitter.com/intent/tweet?' +
      'text=' +
      encodeURIComponent(text) +
      '&url=' +
      encodeURIComponent(this.item.webLink);
    window.open(
      url,
      'twShareWindow',
      'height=269,width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0'
    );
  }
}
