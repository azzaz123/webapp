import { InboxConversationService } from '../../core/inbox/inbox-conversation.service';
import { InboxConversation } from '../../core/model/inbox-conversation';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorsService } from '@core/errors/errors.service';
import { AsYouType, format, getCountryCallingCode, isValidNumber } from 'libphonenumber-js/custom';
import { metadata } from 'assets/js/metadata-phonenumber';

import { RealTimeService } from 'app/core/message/real-time.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { ItemDetailRoutePipe } from '@shared/pipes';

@Component({
  selector: 'tsl-send-phone',
  templateUrl: './send-phone.component.html',
  styleUrls: ['./send-phone.component.scss'],
})
export class SendPhoneComponent implements OnInit {
  public conversation: InboxConversation;
  public sendPhoneForm: FormGroup;
  @ViewChild('phoneInput', { static: true }) phoneField: ElementRef;

  constructor(
    private fb: FormBuilder,
    private realTimeService: RealTimeService,
    private inboxConversationService: InboxConversationService,
    private errorsService: ErrorsService,
    private itemDetailRoutePipe: ItemDetailRoutePipe,
    public activeModal: NgbActiveModal
  ) {
    this.sendPhoneForm = this.fb.group({
      phone: ['', [Validators.required, this.phoneNumberFormatValidator]],
    });
  }

  ngOnInit() {
    this.phoneField.nativeElement.focus();
  }

  private phoneNumberFormatValidator(control: FormControl) {
    return isValidNumber(control.value, 'ES', metadata) ? null : { invalid: true };
  }

  public handleSubmit() {
    const phoneNumber = this.sendPhoneForm.controls.phone.value;

    if (!this.sendPhoneForm.valid) {
      this.sendPhoneForm.controls.phone.markAsDirty();
      this.errorsService.i18nError(TRANSLATION_KEY.FORM_FIELD_ERROR);
      return;
    }

    this.inboxConversationService.addPhoneNumberToConversation$(this.conversation, phoneNumber).subscribe();
    this.realTimeService.addPhoneNumberMessageToConversation(this.conversation, phoneNumber);
    this.conversation.phoneRequired = false;
    this.activeModal.close();
  }

  formatNumber(event: any) {
    const prefix = '+' + getCountryCallingCode('ES', metadata);
    const hasPrefix = event.target.value.indexOf(prefix) > -1;
    const numberOfDigits = hasPrefix
      ? event.target.value.split(prefix)[1].split(' ').join('').length
      : event.target.value.split(' ').join('').length;
    event.target.value = new AsYouType('ES', metadata).input(event.target.value);
    event.target.onkeypress = () => !(numberOfDigits >= 9);
    if (numberOfDigits === 9) {
      if (event.target.value.indexOf(prefix) === -1) {
        event.target.value = prefix.concat(' ', event.target.value);
      } else {
        event.target.value = format(event.target.value.toString(), 'ES', 'International', metadata);
      }
    }
    this.sendPhoneForm.setValue({
      phone: event.target.value,
    });
  }

  dismiss() {
    const itemUrl = this.itemDetailRoutePipe.transform(this.conversation.item.itemSlug);
    window.location.href = itemUrl;
  }
}
