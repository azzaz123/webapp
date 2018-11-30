import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from '../../../core/message/message.service';
import { Conversation } from '../../../core/conversation/conversation';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ErrorsService } from '../../../core/errors/errors.service';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { environment } from '../../../../environments/environment';
import { WindowRef } from '../../../core/window/window.service';
import { HttpService } from '../../../core/http/http.service';
import { format, AsYouType, getCountryCallingCode, isValidNumber } from 'libphonenumber-js';

@Component({
  selector: 'tsl-send-phone',
  templateUrl: './send-phone.component.html',
  styleUrls: ['./send-phone.component.scss']
})
export class SendPhoneComponent implements OnInit {

  @Input() conversation: Conversation;
  @Input() required: boolean;
  @Input() phone: string;
  @ViewChild('phoneInput') phoneField: ElementRef;
  public sendPhoneForm: FormGroup;
  protected API_URL = 'api/v3/conversations';

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private http: HttpService,
    private errorsService: ErrorsService,
    private trackingService: TrackingService,
    private windowRef: WindowRef,
    public activeModal: NgbActiveModal) {
    this.trackingService.trackAccumulatedEvents();
    this.sendPhoneForm = this.fb.group({
      phone: ['', [Validators.required, this.phoneNumberFormatValidator]]
    });
  }

  ngOnInit() {
    setTimeout(() => this.phoneField.nativeElement.focus(), 1000);
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
        this.messageService.addPhoneNumberRequestMessage(this.conversation, false);
        this.trackingService.addTrackingEvent({
          eventData: TrackingService.ITEM_SHAREPHONE_SENDPHONE,
          attributes: { item_id: this.conversation.item.id }
        });
      } else {
        this.trackingService.addTrackingEvent({ eventData: TrackingService.CHAT_SHAREPHONE_ACCEPTSHARING });
      }
      this.http.put(`${this.API_URL}/${this.conversation.id}/buyer-phone-number`, {
        phone_number: phoneNumber
      }).subscribe();
      this.messageService.createPhoneNumberMessage(this.conversation, phoneNumber);
      this.activeModal.close();
    } else if (!this.sendPhoneForm.controls.phone.valid) {
      this.trackingService.addTrackingEvent({
        eventData: TrackingService.ITEM_SHAREPHONE_WRONGPHONE,
        attributes: { item_id: this.conversation.item.id, phone_number: phoneNumber }
      });
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
        event.target.value = format(event.target.value.toString() , 'ES', 'International');
      }
    }
    this.sendPhoneForm.setValue({
      phone: event.target.value
    });
  }

  dismiss() {
    if (this.required) {
      this.trackingService.track(TrackingService.ITEM_SHAREPHONE_HIDEFORM, { item_id: this.conversation.item.id });
      this.windowRef.nativeWindow.location.href = environment.siteUrl + 'item/' + this.conversation.item.webSlug;
    } else {
      this.trackingService.addTrackingEvent({ eventData: TrackingService.CHAT_SHAREPHONE_CANCELSHARING });
      this.activeModal.dismiss();
    }
  }
}
