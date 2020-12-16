import { InboxConversationService } from './../../core/inbox/inbox-conversation.service';
import { InboxConversation } from './../../core/model/inbox-conversation';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ErrorsService } from '@core/errors/errors.service';
import { TrackingService } from '@core/tracking/tracking.service';
import {
  AsYouType,
  format,
  getCountryCallingCode,
  isValidNumber,
} from 'libphonenumber-js/custom';
import { metadata } from 'assets/js/metadata-phonenumber';

import { RealTimeService } from 'app/core/message/real-time.service';

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
    private trackingService: TrackingService,
    public activeModal: NgbActiveModal
  ) {
    this.sendPhoneForm = this.fb.group({
      phone: ['', [Validators.required, this.phoneNumberFormatValidator]],
    });
  }

  ngOnInit() {
    this.phoneField.nativeElement.focus();
    this.trackSendPhoneModalOpened();
  }

  private trackSendPhoneModalOpened() {
    this.trackingService.track(TrackingService.ITEM_SHAREPHONE_SHOWFORM, {
      item_id: this.conversation.item.id,
    });
  }

  private phoneNumberFormatValidator(control: FormControl) {
    return isValidNumber(control.value, 'ES', metadata)
      ? null
      : { invalid: true };
  }

  public handleSubmit() {
    const phoneNumber = this.sendPhoneForm.controls.phone.value;

    if (!this.sendPhoneForm.valid) {
      this.trackingService.track(TrackingService.ITEM_SHAREPHONE_WRONGPHONE, {
        item_id: this.conversation.item.id,
        phone_number: phoneNumber,
      });
      this.sendPhoneForm.controls.phone.markAsDirty();
      this.errorsService.i18nError('formErrors');
      return;
    }

    this.trackingService.track(TrackingService.ITEM_SHAREPHONE_SENDPHONE, {
      item_id: this.conversation.item.id,
    });
    this.inboxConversationService
      .addPhoneNumberToConversation$(this.conversation, phoneNumber)
      .subscribe();
    this.realTimeService.addPhoneNumberMessageToConversation(
      this.conversation,
      phoneNumber
    );
    this.activeModal.close();
  }

  formatNumber(event: any) {
    const prefix = '+' + getCountryCallingCode('ES', metadata);
    const hasPrefix = event.target.value.indexOf(prefix) > -1;
    const numberOfDigits = hasPrefix
      ? event.target.value.split(prefix)[1].split(' ').join('').length
      : event.target.value.split(' ').join('').length;
    event.target.value = new AsYouType('ES', metadata).input(
      event.target.value
    );
    event.target.onkeypress = () => !(numberOfDigits >= 9);
    if (numberOfDigits === 9) {
      if (event.target.value.indexOf(prefix) === -1) {
        event.target.value = prefix.concat(' ', event.target.value);
      } else {
        event.target.value = format(
          event.target.value.toString(),
          'ES',
          'International',
          metadata
        );
      }
    }
    this.sendPhoneForm.setValue({
      phone: event.target.value,
    });
  }

  dismiss() {
    this.trackingService.track(TrackingService.ITEM_SHAREPHONE_HIDEFORM, {
      item_id: this.conversation.item.id,
    });
    window.location.href = this.conversation.item.itemUrl;
  }
}