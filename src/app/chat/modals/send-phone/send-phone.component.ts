import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from '../../service/message.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorsService } from '../../../core/errors/errors.service';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { WindowRef } from '../../../core/window/window.service';
import { AsYouType, format, getCountryCallingCode, isValidNumber } from 'libphonenumber-js';
import { InboxConversation } from '../../model';
import { InboxConversationService } from '../../service';

@Component({
  selector: 'tsl-send-phone',
  templateUrl: './send-phone.component.html',
  styleUrls: ['./send-phone.component.scss']
})
export class SendPhoneComponent implements OnInit {

  @Input() conversation: InboxConversation;
  @Input() required: boolean;
  @Input() phone: string;
  @ViewChild('phoneInput', { static: true }) phoneField: ElementRef;
  public sendPhoneForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private inboxConversationService: InboxConversationService,
    private errorsService: ErrorsService,
    private trackingService: TrackingService,
    private windowRef: WindowRef,
    public activeModal: NgbActiveModal) {
    this.sendPhoneForm = this.fb.group({
      phone: ['', [Validators.required, this.phoneNumberFormatValidator]]
    });
  }

  ngOnInit() {
    this.phoneField.nativeElement.focus();
    if (this.phone) {
      this.sendPhoneForm.setValue({
        phone: this.phone
      });
    }
  }

  private phoneNumberFormatValidator(control: FormControl) {
    return isValidNumber(control.value, 'ES') ? null : { invalid: true };
  }

  createPhoneNumberMessage() {
    const phoneNumber = this.sendPhoneForm.controls.phone.value;
    if (this.sendPhoneForm.valid) {
      if (this.required) {
        this.trackingService.track(TrackingService.ITEM_SHAREPHONE_SENDPHONE, { item_id: this.conversation.item.id });
      } else {
        this.trackingService.track(TrackingService.CHAT_SHAREPHONE_ACCEPTSHARING);
      }
      this.inboxConversationService.addPhoneNumberToConversation$(this.conversation, phoneNumber).subscribe();
      this.messageService.createPhoneNumberMessage(this.conversation, phoneNumber);
      this.activeModal.close();
    } else if (!this.sendPhoneForm.controls.phone.valid) {
      this.trackingService.track(TrackingService.ITEM_SHAREPHONE_WRONGPHONE, { item_id: this.conversation.item.id, phone_number: phoneNumber });
      this.sendPhoneForm.controls.phone.markAsDirty();
      this.errorsService.i18nError('formErrors');
    }
  }

  formatNumber(event: any) {
    const prefix = '+' + getCountryCallingCode('ES');
    const hasPrefix = event.target.value.indexOf(prefix) > -1;
    const numberOfDigits = hasPrefix ? event.target.value.split(prefix)[1].split(' ').join('').length
      : event.target.value.split(' ').join('').length;
    event.target.value = new AsYouType('ES').input(event.target.value);
    event.target.onkeypress = () => !(numberOfDigits >= 9);
    if (numberOfDigits === 9) {
      if (event.target.value.indexOf(prefix) === -1) {
        event.target.value = prefix.concat(' ', event.target.value);
      } else {
        event.target.value = format(event.target.value.toString(), 'ES', 'International');
      }
    }
    this.sendPhoneForm.setValue({
      phone: event.target.value
    });
  }

  dismiss() {
    if (this.required) {
      this.trackingService.track(TrackingService.ITEM_SHAREPHONE_HIDEFORM, { item_id: this.conversation.item.id });
      this.windowRef.nativeWindow.location.href = this.conversation.item.itemUrl;
    } else {
      this.trackingService.track(TrackingService.CHAT_SHAREPHONE_CANCELSHARING);
      this.activeModal.dismiss();
    }
  }
}
