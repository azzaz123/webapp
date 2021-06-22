import { Component } from '@angular/core';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalProperties } from './confirmation-modal.interface';

@Component({
  selector: 'tsl-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModalComponent {
  public properties: ConfirmationModalProperties;

  constructor(private i18nService: I18nService, public activeModal: NgbActiveModal) {}

  ngOnInit() {
    if (!this.properties.cancelMessage) {
      this.properties.cancelMessage = this.i18nService.translate(TRANSLATION_KEY.CANCEL_BUTTON);
    }
  }
}
